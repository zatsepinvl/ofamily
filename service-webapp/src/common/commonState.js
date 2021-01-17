export const createAction = (type) => (payload) => ({type, payload});
export const createErrorAction = (type) => (error) => ({type, error});