import dirTree from 'directory-tree';

const pickUrl = (tree: dirTree.DirectoryTree[], pagesPath: string, pathUrlPair: { path: string, url: string }[] = []) => {
  tree.forEach((file) => {
    if (file.children) {
      pickUrl(file.children, pagesPath, pathUrlPair);
    } else {
      pathUrlPair.push({
        path: file.path,
        url: pickOneUrl(file.path, pagesPath)
      });
    }
  })

  return pathUrlPair;
}

export const pickOneUrl = (path: string, pagesPath: string) => path
  .replace(pagesPath, '')
  .replace(/index/g, '')
  .replace(/\[(.*)]/g, str => str
    .replace('[', ':')
    .replace(']', '')
  )
  .replace(/\.(tsx|jsx)$/, '')
  .replace(/(\/\/+)/g, '/')

export default pickUrl;
