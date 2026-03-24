export const handleServiceError = (error: any): never => {
    const toast = useToast()
    const responseData = error.response?.data
    
    let title = responseData?.message || 'Gagal'
    let message = ''
    
    if (error.response?.status === 422 && responseData?.errors) {
        message = responseData.errors.map((err: any) => err.message).join(', ')
    } else {
        message = responseData?.message || error.message || error || 'Terjadi kesalahan'
        if (message === title) message = '' 
    }
    
    toast.error({
      title: title,
      message: message,
    })
    
    throw new Error()
}