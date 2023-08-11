import mongoose, { Schema } from 'mongoose'

const candidatoSchema = new Schema({}, { timestamps: true })

candidatoSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
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
