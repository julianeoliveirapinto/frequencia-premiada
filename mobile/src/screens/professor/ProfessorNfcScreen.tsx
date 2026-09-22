import { useEffect, useState } from 'react'
import { Alert, Text } from 'react-native'
import NfcManager, { NfcTech } from 'react-native-nfc-manager'
import { api, mensagemErro } from '../../services/api'
import { Button, Card, Screen, Subtitle, Title, colors } from '../../components/Ui'

export default function ProfessorNfcScreen() {
  const [lendo, setLendo] = useState(false); const [ultimo, setUltimo] = useState<any>(null)
  useEffect(() => { NfcManager.start().catch(() => Alert.alert('NFC indisponível')); return () => { void NfcManager.cancelTechnologyRequest() } }, [])
  const ler = async () => { setLendo(true); try { await NfcManager.requestTechnology([NfcTech.Ndef, NfcTech.NfcA]); const tag = await NfcManager.getTag(); if (!tag?.id) throw new Error('Tag sem identificador'); const codigo = Array.isArray(tag.id) ? tag.id.map((b: number) => b.toString(16).padStart(2, '0')).join('').toUpperCase() : String(tag.id); const { data } = await api.post('/checkin', { tag_nfc: codigo }); setUltimo(data.aluno); Alert.alert('Presença registrada', data.aluno.nome) } catch (e: any) { if (e.response) Alert.alert('Não foi possível registrar', mensagemErro(e)) } finally { setLendo(false); void NfcManager.cancelTechnologyRequest() } }
  return <Screen><Title>Leitura NFC</Title><Subtitle>Aproxime a tag do aluno. Esta tela existe somente na navegação do professor.</Subtitle><Button title={lendo ? 'Aguardando tag...' : 'Iniciar leitura'} disabled={lendo} onPress={ler} />{ultimo && <Card><Text style={{ color: colors.muted }}>Último registro</Text><Text style={{ color: colors.text, fontSize: 22, fontWeight: '900', marginTop: 6 }}>{ultimo.nome}</Text><Text style={{ color: colors.primary }}>{ultimo.pontos} pontos</Text></Card>}</Screen>
}

