import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type RankingResponse = {
  me: {
    position: number
    points: number
    level: {
      name: string
      minimum: number
      nextLevel: string | null
      nextMinimum: number | null
      percent: number
    }
  }
  rules: { pointsPerPresence: number; description: string }
  entries: Array<{ position: number; displayName: string; points: number }>
  leaderboardAvailable: boolean
}

export async function getMyRanking(): Promise<RankingResponse> {
  const baseURL = process.env.EXPO_PUBLIC_API_URL
  if (!baseURL) throw new Error('Configure EXPO_PUBLIC_API_URL para acessar o ranking.')

  const token = await AsyncStorage.getItem('token')
  if (!token) throw new Error('Faça login novamente para consultar o ranking.')

  const response = await axios.get<RankingResponse>(`${baseURL.replace(/\/$/, '')}/alunos/me/ranking`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}
