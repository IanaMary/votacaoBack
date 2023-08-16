import { ContasEntrada } from '.'
import { User } from '../user'

let user, contasEntrada

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  contasEntrada = await ContasEntrada.create({ user, nome: 'test', valor: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = contasEntrada.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(contasEntrada.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.nome).toBe(contasEntrada.nome)
    expect(view.valor).toBe(contasEntrada.valor)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = contasEntrada.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(contasEntrada.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.nome).toBe(contasEntrada.nome)
    expect(view.valor).toBe(contasEntrada.valor)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
