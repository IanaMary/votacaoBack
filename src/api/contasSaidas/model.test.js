import { ContasSaidas } from '.'
import { User } from '../user'

let user, contasSaidas

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  contasSaidas = await ContasSaidas.create({ user, valor: 'test', nome: 'test', pago: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = contasSaidas.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(contasSaidas.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.valor).toBe(contasSaidas.valor)
    expect(view.nome).toBe(contasSaidas.nome)
    expect(view.pago).toBe(contasSaidas.pago)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = contasSaidas.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(contasSaidas.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.valor).toBe(contasSaidas.valor)
    expect(view.nome).toBe(contasSaidas.nome)
    expect(view.pago).toBe(contasSaidas.pago)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
