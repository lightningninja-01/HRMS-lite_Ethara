import { useEffect, useState } from "react"
import axios from "axios"

import Loading from "./Loading"
import Empty from "./Empty"
import Error from "./Error"


// 🔥 IMPORTANT → replace with your Render backend URL
const API = "https://YOUR-BACKEND.onrender.com"


export default function App() {

  const [employees, setEmployees] = useState([])
  const [attendance, setAttendance] = useState({})
  const [stats, setStats] = useState({})

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [filterDate, setFilterDate] = useState("")

  const [form, setForm] = useState({
    emp_id: "",
    name: "",
    email: "",
    department: ""
  })


  // ✅ FIXED timezone bug (local date)
  const today = new Date().toLocaleDateString("en-CA")


  // =========================
  // Load Employees
  // =========================

  const loadEmployees = async () => {
    try {
      setLoading(true)

      const res = await axios.get(`${API}/employees`)
      setEmployees(res.data)

      const dash = await axios.get(`${API}/dashboard`)
      setStats(dash.data)

      res.data.forEach(e => loadAttendance(e.id))

      setError(null)

    } catch {
      setError("Backend server not reachable. Please try again.")
    }
    finally {
      setLoading(false)
    }
  }


  const loadAttendance = async (id) => {

    const url = filterDate
      ? `${API}/attendance/${id}?date=${filterDate}`
      : `${API}/attendance/${id}`

    const res = await axios.get(url)

    setAttendance(prev => ({
      ...prev,
      [id]: res.data
    }))
  }


  useEffect(() => {
    loadEmployees()
  }, [filterDate])


  // =========================
  // Add Employee
  // =========================

  const addEmployee = async () => {
    try {

      await axios.post(`${API}/employees`, form)

      setForm({
        emp_id: "",
        name: "",
        email: "",
        department: ""
      })

      loadEmployees()

    } catch (err) {

      // ⭐ SHOW BACKEND VALIDATION ERRORS
      const msg =
        err.response?.data?.error ||
        "Something went wrong"

      alert(msg)
    }
  }


  // =========================
  // Attendance
  // =========================

  const markAttendance = async (id, status) => {
    await axios.post(`${API}/attendance`, {
      employee_id: id,
      date: today,
      status
    })

    loadEmployees()
  }


  const deleteEmployee = async (id) => {
    await axios.delete(`${API}/employees/${id}`)
    loadEmployees()
  }


  // =========================
  // UI STATES
  // =========================

  if (loading) return <Loading />
  if (error) return <Error message={error} />


  // =========================
  // UI
  // =========================

  return (
    <div className="container my-5" style={{ maxWidth: 900 }}>

      <h2 className="text-center mb-4">
        HRMS Lite – Admin Panel
      </h2>


      {/* Dashboard */}
      <div className="row text-center mb-4">
        <div className="col">Employees: {stats.totalEmployees}</div>
        <div className="col text-success">Present: {stats.present}</div>
        <div className="col text-danger">Absent: {stats.absent}</div>
      </div>


      {/* Date Filter */}
      <input
        type="date"
        className="form-control mb-4"
        value={filterDate}
        onChange={e => setFilterDate(e.target.value)}
      />


      {/* Add Form */}
      <div className="card p-3 mb-4">

        <h5>Add Employee</h5>

        {Object.keys(form).map(k => (
          <input
            key={k}
            className="form-control mb-2"
            placeholder={k}
            value={form[k]}
            onChange={e => setForm({
              ...form,
              [k]: e.target.value
            })}
          />
        ))}

        <button
          className="btn btn-primary"
          onClick={addEmployee}
        >
          Add Employee
        </button>
      </div>


      {employees.length === 0 && <Empty />}


      {/* Employee Cards */}
      {employees.map(e => (

        <div key={e.id} className="card p-3 mb-3">

          <h5>{e.name} ({e.emp_id})</h5>
          <small className="text-muted">{e.department}</small>

          <div>Present Days: {e.present_days}</div>

          <div className="mt-2">
            <button
              className="btn btn-success btn-sm me-2"
              onClick={() => markAttendance(e.id, "Present")}
            >
              Present
            </button>

            <button
              className="btn btn-warning btn-sm me-2"
              onClick={() => markAttendance(e.id, "Absent")}
            >
              Absent
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteEmployee(e.id)}
            >
              Delete
            </button>
          </div>


          <ul className="mt-2">
            {attendance[e.id]?.map((a, i) => (
              <li key={i}>
                {a.date} – {a.status}
              </li>
            ))}
          </ul>

        </div>
      ))}

    </div>
  )
}
