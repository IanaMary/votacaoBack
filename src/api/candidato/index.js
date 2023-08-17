import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, createMany, index, show, update, destroy } from './controller'
import { schema } from './model'
export Candidato, { schema } from './model'

const router = new Router()
const { nome } = schema.tree

/**
 * @api {post} /candidatos Create candidato
 * @apiName CreateCandidato
 * @apiGroup Candidato
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam nome Candidato's nome.
 * @apiSuccess {Object} candidato Candidato's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Candidato not found.
 * @apiError 401 admin access only.
 */
router.post('/',
  token({ required: true, roles: ['admin'] }),
  body({ nome }),
  create)

router.post('/many',
  token({ required: true, roles: ['admin'] }),
  createMany)

/**
 * @api {get} /candidatos Retrieve candidatoes
 * @apiName RetrieveCandidatoes
 * @apiGroup Candidato
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of candidatoes.
 * @apiSuccess {Object[]} rows List of candidatoes.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /candidatos/:id Retrieve candidato
 * @apiName RetrieveCandidato
 * @apiGroup Candidato
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} candidato Candidato's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Candidato not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /candidatos/:id Update candidato
 * @apiName UpdateCandidato
 * @apiGroup Candidato
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam nome Candidato's nome.
 * @apiSuccess {Object} candidato Candidato's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Candidato not found.
 * @apiError 401 admin access only.
 */
router.put('/:id',
  token({ required: true, roles: ['admin'] }),
  body({ nome }),
  update)

/**
 * @api {delete} /candidatos/:id Delete candidato
 * @apiName DeleteCandidato
 * @apiGroup Candidato
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Candidato not found.
 * @apiError 401 admin access only.
 */
router.delete('/:id',
  token({ required: true, roles: ['admin'] }),
  destroy)

export default router
