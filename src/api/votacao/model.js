import mongoose, { Schema } from 'mongoose'

const votacaoSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  dataInicio: {
    type: Date,
    required: true
  },
  dataFim: {
    type: Date,
    required: true
  },
  candidatos: [{
    type: Schema.ObjectId,
    ref: 'Candidato',
    required: true
  }],
  multiVotos: {
    type: Boolean,
    default: false,
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

votacaoSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      nome: this.nome,
      descricao: this.descricao,
      dataInicio: this.dataInicio,
      dataFim: this.dataFim,
      multiVotos: this.multiVotos,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Votacao', votacaoSchema)

export const schema = model.schema
export default model
