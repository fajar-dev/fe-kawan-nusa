export const handleServiceError = (error: any): never => {
    const toast = useToast()
    const message = error.response?.data?.message || 'An error occurred'
    toast.error({
      title: 'Gagal',
      message: message,
    })
    throw new Error(message)
}