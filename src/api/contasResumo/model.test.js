import { ContasResumo } from '.'
import { User } from '../user'

let user, contasResumo

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  contasResumo = await ContasResumo.create({ user, totalPagar: 'test', totalPago: 'test', totalRecebido: 'test', totalCaixa: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = contasResumo.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(contasResumo.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.totalPagar).toBe(contasResumo.totalPagar)
    expect(view.totalPago).toBe(contasResumo.totalPago)
    expect(view.totalRecebido).toBe(contasResumo.totalRecebido)
    expect(view.totalCaixa).toBe(contasResumo.totalCaixa)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = contasResumo.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(contasResumo.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.totalPagar).toBe(contasResumo.totalPagar)
    expect(view.totalPago).toBe(contasResumo.totalPago)
    expect(view.totalRecebido).toBe(contasResumo.totalRecebido)
    expect(view.totalCaixa).toBe(contasResumo.totalCaixa)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
