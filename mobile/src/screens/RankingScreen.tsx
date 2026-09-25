import { useCallback, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { getMyRanking, RankingResponse } from '../services/rankingService'

export default function RankingScreen() {
  const [ranking, setRanking] = useState<RankingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useFocusEffect(useCallback(() => {
    let active = true
    setLoading(true)
    setError('')
    getMyRanking()
      .then(response => { if (active) setRanking(response) })
      .catch((reason: unknown) => {
        if (active) {
          setRanking(null)
          setError(reason instanceof Error && reason.message.startsWith('Configure')
            ? reason.message : 'Não foi possível carregar o ranking. Verifique sua conexão e tente novamente.')
        }
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [refreshKey]))

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>GAMIFICAÇÃO</Text>
      <Text style={styles.title}>Meu progresso</Text>
      {loading ? <View style={styles.center}><ActivityIndicator color="#adc6ff" size="large" /><Text style={styles.muted}>Carregando progresso...</Text></View>
      : error ? <View style={styles.card}><Text style={styles.body}>{error}</Text><TouchableOpacity accessibilityRole="button" onPress={() => setRefreshKey(value => value + 1)} style={styles.retry}><Text style={styles.retryText}>Tentar novamente</Text></TouchableOpacity></View>
      : ranking ? <>
        <View style={styles.card}>
          <Text style={styles.label}>SUA POSIÇÃO NA TURMA</Text>
          <Text style={styles.value}>{ranking.me.position}º lugar</Text>
          <Text style={styles.body}>{ranking.me.points} pontos · {ranking.me.level.name}</Text>
          <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: ranking.me.level.percent }} style={styles.track}>
            <View style={[styles.fill, { width: `${ranking.me.level.percent}%` }]} />
          </View>
          <Text style={styles.muted}>{ranking.me.level.nextMinimum === null
            ? 'Você alcançou o nível mais alto configurado.'
            : `Faltam ${Math.max(0, ranking.me.level.nextMinimum - ranking.me.points)} pontos para ${ranking.me.level.nextLevel}.`}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.section}>Como funcionam os pontos</Text>
          <Text style={styles.body}>{ranking.rules.description}</Text>
          <Text style={styles.muted}>A pontuação é atualizada pelos registros oficiais da escola.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.section}>Destaques da turma</Text>
          {!ranking.leaderboardAvailable ? <Text style={styles.muted}>Ranking coletivo indisponível para turmas pequenas. Seu progresso continua visível acima.</Text>
            : ranking.entries.length === 0 ? <Text style={styles.muted}>Ainda não há posições para mostrar.</Text>
            : ranking.entries.map(entry => <View key={entry.position} style={styles.row}>
              <Text style={styles.position}>{entry.position}º</Text>
              <Text style={styles.alias}>{entry.displayName}</Text>
              <Text style={styles.points}>{entry.points} pts</Text>
            </View>)}
        </View>
      </> : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#10131a' },
  content: { padding: 20, paddingBottom: 36 },
  eyebrow: { color: '#adc6ff', fontSize: 13, fontWeight: '700', letterSpacing: 2 },
  title: { color: '#fff', fontSize: 30, fontWeight: '800', marginTop: 7, marginBottom: 22 },
  card: { padding: 20, backgroundColor: '#1b2233', borderRadius: 18, borderWidth: 1, borderColor: '#354057', marginBottom: 15 },
  label: { color: '#b9c8e5', fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  value: { color: '#fff', fontSize: 30, fontWeight: '800', marginTop: 6 },
  body: { color: '#e5eaf4', fontSize: 16, lineHeight: 24, marginTop: 8 },
  muted: { color: '#b9c3d5', fontSize: 14, lineHeight: 21, marginTop: 11 },
  track: { height: 10, backgroundColor: '#3b465a', borderRadius: 10, overflow: 'hidden', marginTop: 18 },
  fill: { height: '100%', backgroundColor: '#adc6ff' },
  section: { color: '#fff', fontSize: 19, fontWeight: '800' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#354057' },
  position: { color: '#adc6ff', width: 38, fontSize: 16, fontWeight: '700' },
  alias: { color: '#e5eaf4', flex: 1, fontSize: 16 },
  points: { color: '#e5eaf4', fontSize: 14, fontWeight: '700' },
  center: { alignItems: 'center', padding: 40 },
  retry: { backgroundColor: '#adc6ff', padding: 13, borderRadius: 10, marginTop: 18, alignItems: 'center' },
  retryText: { color: '#10131a', fontWeight: '800' },
})
