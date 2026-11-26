
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { AccessToken } from 'livekit-server-sdk';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/token', rateLimit({
  windowMs: 60 * 1000,
  max: 30
}));

app.get('/', (req, res) => {
  res.send('Shoof Token Server is running!');
});

app.get('/token', async (req, res) => {
  try {
    const { room, user, role } = req.query;

    if (!room || !user || !['host', 'viewer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    if (room.length > 100 || user.length > 100) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const serverUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !serverUrl) {
      return res.status(500).json({ error: 'Server not configured' });
    }

    const token = new AccessToken(apiKey, apiSecret, {
      identity: user,
      ttl: '10m'
    });

    token.addGrant({
      roomJoin: true,
      room,
      canPublish: role === 'host',
      canSubscribe: true,
      canPublishData: role === 'host'
    });

    const jwt = await token.toJwt();

    res.json({
      url: serverUrl,
      token: jwt
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Token generation failed' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Shoof server running on ${PORT}`);
});
