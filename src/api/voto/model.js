import mongoose, { Schema } from 'mongoose'

const votoSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  idVotacao: {
    type: Schema.ObjectId,
    ref: 'Votacao',
    required: true
  },
  idCandidato: {
    type: Schema.ObjectId,
    ref: 'Candidato',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

votoSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      idUsuario: this.idUsuario,
      idVotacao: this.idVotacao,
      idCandidato: this.idCandidato,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Voto', votoSchema)

export const schema = model.schema
export default model
