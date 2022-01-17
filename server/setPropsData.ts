import { RequestHandler } from 'express-serve-static-core';
import { pageLoader } from './pageLoader';

export const setPropsData: RequestHandler = async(req, res) => {
  const url = req.originalUrl.replace('/lib/', '');

  const { props } = await pageLoader(url, req.params)
  res.send(props)
}