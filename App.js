import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert
} from 'react-native';
import { registerGlobals, LiveKitRoom } from '@livekit/react-native';
registerGlobals();

const TOKEN_SERVER = 'https://YOUR-TOKEN-SERVER.example'; // replace with deployed server URL
export default function App() {
  const [roomName, setRoomName] = useState('shoof-room-1');
  const [userName, setUserName] = useState('guest');
  const [mode, setMode] = useState(null);
  const [token, setToken] = useState(null);
  const [serverUrl, setServerUrl] = useState(null);
  async function join(role) {
    try {
      const res = await fetch(`${TOKEN_SERVER}/token?room=${encodeURIComponent(roomName)}&user=${encodeURIComponent(userName)}&role=${role}`);
      if (!res.ok) throw new Error('Token server response was not OK');
      const data = await res.json();
      setServerUrl(data.url); setToken(data.token); setMode(role);
    } catch (e) { Alert.alert('تعذر الدخول', 'بعدنا ما ربطنا خادم التوكن. هاي نسخة هيكل أولي.'); }
  }
  if (token) return <LiveKitRoom serverUrl={serverUrl} token={token} connect={true} audio={mode==='host'} video={mode==='host'} onDisconnected={()=>{setToken(null);setMode(null);}}><View style={s.container}><Text style={s.title}>شوف LIVE</Text><Text style={s.sub}>متصل بالغرفة: {roomName}</Text><Pressable style={s.button} onPress={()=>{setToken(null);setMode(null);}}><Text style={s.buttonText}>إنهاء / خروج</Text></Pressable></View></LiveKitRoom>;
  return <View style={s.container}><Text style={s.logo}>شــوف</Text><Text style={s.title}>تجربة البث المباشر</Text><TextInput style={s.input} value={userName} onChangeText={setUserName} placeholder="اسم المستخدم" placeholderTextColor="#888"/><TextInput style={s.input} value={roomName} onChangeText={setRoomName} placeholder="اسم الغرفة" placeholderTextColor="#888"/><Pressable style={s.button} onPress={()=>join('host')}><Text style={s.buttonText}>🔴 ابدأ بث (مضيف)</Text></Pressable><Pressable style={s.button2} onPress={()=>join('viewer')}><Text style={s.buttonText}>▶️ دخول كمشاهد</Text></Pressable><Text style={s.note}>نموذج تطوير أولي. يحتاج خادم توكن LiveKit قبل الاتصال.</Text></View>;
}
const s=StyleSheet.create({container:{flex:1,backgroundColor:'#08090d',alignItems:'center',justifyContent:'center',padding:24},logo:{color:'#ff3984',fontSize:44,fontWeight:'900',marginBottom:16},title:{color:'#fff',fontSize:22,fontWeight:'700',marginBottom:20},sub:{color:'#b7c6d2',marginBottom:24},input:{width:'100%',backgroundColor:'#151822',color:'#fff',padding:14,borderRadius:12,marginVertical:8},button:{width:'100%',backgroundColor:'#f02c87',padding:16,borderRadius:12,marginTop:12,alignItems:'center'},button2:{width:'100%',backgroundColor:'#188dd6',padding:16,borderRadius:12,marginTop:12,alignItems:'center'},buttonText:{color:'#fff',fontWeight:'700',fontSize:16},note:{color:'#9aa4b2',textAlign:'center',marginTop:22,lineHeight:20}});
