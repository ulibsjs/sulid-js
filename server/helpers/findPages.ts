import dirTree from 'directory-tree';

const findPages = (fullPagesPath: string) => dirTree(fullPagesPath, {
  extensions: /\.(jsx|tsx)$/,
  exclude: /lib/,
}).children!;

export default findPages;
