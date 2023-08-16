import mongoose, { Schema } from 'mongoose'

const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']

const contasEntradaSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  ano: {
    type: Number,
    required: true
  },
  mes: {
    type: String,
    enum: meses,
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

contasEntradaSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      nome: this.nome,
      ano: this.ano,
      mes: this.mes,
      valor: this.valor,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('ContasEntrada', contasEntradaSchema)

export const schema = model.schema
export default model
