/* @flow */

export const upload = {
  mutation: `
    mutation Upload($files: [String]) {
      upload(files: $files)
    }
  `,
};
