import { Candidato } from '.'

let candidato

beforeEach(async () => {
  candidato = await Candidato.create({})
})

describe('view', () => {
  it('returns simple view', () => {
    const view = candidato.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(candidato.id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = candidato.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(candidato.id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
