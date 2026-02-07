export default function Error({ message }) {
  return (
    <div className="alert alert-danger text-center my-4">
      {message}
    </div>
  )
}
