import { Votacao } from '.'

let votacao

beforeEach(async () => {
  votacao = await Votacao.create({ nome: 'test', descricao: 'test', dataInicio: 'test', dataFim: 'test', candidatos: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = votacao.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(votacao.id)
    expect(view.nome).toBe(votacao.nome)
    expect(view.descricao).toBe(votacao.descricao)
    expect(view.dataInicio).toBe(votacao.dataInicio)
    expect(view.dataFim).toBe(votacao.dataFim)
    expect(view.candidatos).toBe(votacao.candidatos)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = votacao.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(votacao.id)
    expect(view.nome).toBe(votacao.nome)
    expect(view.descricao).toBe(votacao.descricao)
    expect(view.dataInicio).toBe(votacao.dataInicio)
    expect(view.dataFim).toBe(votacao.dataFim)
    expect(view.candidatos).toBe(votacao.candidatos)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
