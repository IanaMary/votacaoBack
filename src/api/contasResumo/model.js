import mongoose, { Schema } from 'mongoose'

const contasResumoSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  totalPagar: {
    type: Number
  },
  totalPago: {
    type: Number
  },
  totalRecebido: {
    type: Number
  },
  totalCaixa: {
    type: Number
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

contasResumoSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      totalPagar: this.totalPagar,
      totalPago: this.totalPago,
      totalRecebido: this.totalRecebido,
      totalCaixa: this.totalCaixa,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('ContasResumo', contasResumoSchema)

export const schema = model.schema
export default model
