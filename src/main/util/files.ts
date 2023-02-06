import path from 'path';

const RESOURCES_PATH = (isPackaged: boolean) =>
  isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../../assets');

export const getAssetPath = (
  isPackaged: boolean,
  ...paths: string[]
): string => {
  return path.join(RESOURCES_PATH(isPackaged), ...paths);
};

export default getAssetPath;
