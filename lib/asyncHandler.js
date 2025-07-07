

export async function asyncHandler(promiseFn) {
  try {
    const data = await promiseFn;
    return [null, data];
  } catch (error) {
    return [error, null];
  }
}
