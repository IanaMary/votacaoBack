import { Router } from 'express'
import { middleware as query } from 'querymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
export Candidato, { schema } from './model'

const router = new Router()

/**
 * @api {post} /candidatos Create candidato
 * @apiName CreateCandidato
 * @apiGroup Candidato
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess {Object} candidato Candidato's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Candidato not found.
 * @apiError 401 admin access only.
 */
router.post('/',
  token({ required: true, roles: ['admin'] }),
  create)

/**
 * @api {get} /candidatos Retrieve candidatoes
 * @apiName RetrieveCandidatoes
 * @apiGroup Candidato
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} candidatoes List of candidatoes.
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
 * @apiSuccess {Object} candidato Candidato's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Candidato not found.
 * @apiError 401 admin access only.
 */
router.put('/:id',
  token({ required: true, roles: ['admin'] }),
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
