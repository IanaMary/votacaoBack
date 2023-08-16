import mongoose, { Schema } from 'mongoose'

const candidatoSchema = new Schema({
  nome: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

candidatoSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      nome: this.nome,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Candidato', candidatoSchema)

export const schema = model.schema
export default model
