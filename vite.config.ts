import SulidConfig from './types/SulidConfig';
import solidPlugin from 'vite-plugin-solid';


export default {
  plugins: [
    solidPlugin({
      ssr: true,
    })
  ],
  build: {
    minify: false
  },
} as SulidConfig;
