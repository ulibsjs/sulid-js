import { RequestHandler } from 'express-serve-static-core';
import { pageLoader } from './pageLoader';

export const setPropsData: RequestHandler = async(req, res) => {
  const url = req.originalUrl.replace('/data/', '');

  const { props } = await pageLoader(url)
  res.send(props)
}