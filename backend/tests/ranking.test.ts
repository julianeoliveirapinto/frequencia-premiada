import { jest, test, expect, beforeEach } from "@jest/globals"
import { Request, Response } from 'express'
import { meuRanking, rankingPorTurma } from '../src/controllers/alunoController'
import { prisma } from '../src/prisma'

jest.mock('../src/prisma', () => ({ prisma: { aluno: { findUnique: jest.fn(), findMany: jest.fn() } } }))

const findUnique = prisma.aluno.findUnique as unknown as jest.Mock<(...args: any[]) => Promise<any>>
const findMany = prisma.aluno.findMany as unknown as jest.Mock<(...args: any[]) => Promise<any>>
const response = () => {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
  return res as unknown as Response & { status: jest.Mock; json: jest.Mock }
}

beforeEach(() => jest.clearAllMocks())

test('student sees own position without classmates personal data or another class', async () => {
  findUnique.mockResolvedValue({ id: 'student-3', turmaId: 'class-a' })
  findMany.mockResolvedValue([
    { id: 'student-1', nome: 'Ana Maria Silva', pontos: 30 },
    { id: 'student-2', nome: 'Carlos Pereira', pontos: 20 },
    { id: 'student-3', nome: 'Juliane Oliveira', pontos: 10 },
    { id: 'student-4', nome: 'Pedro Santos', pontos: 10 },
    { id: 'student-5', nome: 'Luiza Costa', pontos: 0 },
    { id: 'student-6', nome: 'Beatriz Lima', pontos: 0 },
  ])
  const res = response()
  await meuRanking({ user: { id: 'student-3', role: 'aluno' }, params: { turmaId: 'class-b' } } as unknown as Request, res)
  expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { turmaId: 'class-a' } }))
  const body = res.json.mock.calls[0][0] as any
  expect(body.me.position).toBe(3)
  expect(body.entries[0]).toEqual({ position: 1, displayName: 'A. M.', points: 30 })
  expect(JSON.stringify(body)).not.toMatch(/Ana|Maria|Silva|student-1|class-a/)
})

test('small classes receive only own progress', async () => {
  findUnique.mockResolvedValue({ id: 'student-1', turmaId: 'small' })
  findMany.mockResolvedValue([{ id: 'student-1', nome: 'Ana', pontos: 0 }, { id: 'student-2', nome: 'Bia', pontos: 0 }])
  const res = response()
  await meuRanking({ user: { id: 'student-1', role: 'aluno' } } as Request, res)
  expect((res.json.mock.calls[0][0] as any).entries).toEqual([])
  expect((res.json.mock.calls[0][0] as any).leaderboardAvailable).toBe(false)
})

test('student cannot use legacy endpoint that exposes names', async () => {
  const res = response()
  await rankingPorTurma({ user: { id: 'student-1', role: 'aluno' }, params: { turmaId: 'other' } } as unknown as Request, res)
  expect(res.status).toHaveBeenCalledWith(403)
  expect(findMany).not.toHaveBeenCalled()
})
