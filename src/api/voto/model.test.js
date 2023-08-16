import { Voto } from '.'
import { User } from '../user'

let user, voto

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  voto = await Voto.create({ user, idUsuario: 'test', idVotacao: 'test', idCandidato: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = voto.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(voto.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.idUsuario).toBe(voto.idUsuario)
    expect(view.idVotacao).toBe(voto.idVotacao)
    expect(view.idCandidato).toBe(voto.idCandidato)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = voto.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(voto.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.idUsuario).toBe(voto.idUsuario)
    expect(view.idVotacao).toBe(voto.idVotacao)
    expect(view.idCandidato).toBe(voto.idCandidato)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
