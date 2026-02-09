import { useEffect, useState } from "react"
import axios from "axios"
import Loading from "./Loading"
import Empty from "./Empty"
import Error from "./Error"

const API = "https://hrms-lite-ethara.onrender.com"

export default function App() {

  const [employees, setEmployees] = useState([])
  const [attendance, setAttendance] = useState({})
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterDate, setFilterDate] = useState("")
  const [selectedDate, setSelectedDate] = useState({})

  const today = new Date().toLocaleDateString("en-CA")

  const [form, setForm] = useState({
    emp_id: "", name: "", email: "", department: ""
  })


  const loadEmployees = async () => {
    try {
      setLoading(true)

      const res = await axios.get(`${API}/employees`)
      setEmployees(res.data)

      const dash = await axios.get(`${API}/dashboard`)
      setStats(dash.data)

      res.data.forEach(e => loadAttendance(e.id))

      setError(null)
    }
    catch {
      setError("Backend server not reachable")
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

    setAttendance(prev => ({ ...prev, [id]: res.data }))
  }

  useEffect(() => {
    loadEmployees()
  }, [filterDate])


  const addEmployee = async () => {
    try {
      await axios.post(`${API}/employees`, form)
      setForm({ emp_id:"", name:"", email:"", department:"" })
      loadEmployees()
    } catch (err) {
      alert(err.response?.data?.error || "Error")
    }
  }


  const markAttendance = async (id, status) => {
    try {
      await axios.post(`${API}/attendance`, {
        employee_id: id,
        date: selectedDate[id] || today,   // ⭐ chosen date
        status
      })
      loadEmployees()
    } catch {
      alert("Failed")
    }
  }


  const deleteEmployee = async (id) => {
    await axios.delete(`${API}/employees/${id}`)
    loadEmployees()
  }


  if (loading) return <Loading />
  if (error) return <Error message={error} />


  return (
    <div className="container my-5" style={{maxWidth:"900px"}}>

      <h2 className="text-center mb-4">HRMS Lite – Admin Panel</h2>

      <div className="row mb-4">
        <div className="col">Employees: {stats.totalEmployees}</div>
        <div className="col text-success">Present: {stats.present}</div>
        <div className="col text-danger">Absent: {stats.absent}</div>
      </div>


      <input
        type="date"
        className="form-control mb-3"
        value={filterDate}
        onChange={e => setFilterDate(e.target.value)}
      />


      <div className="mb-4">
        {Object.keys(form).map(k =>
          <input key={k} placeholder={k}
            className="form-control mb-2"
            value={form[k]}
            onChange={e => setForm({...form,[k]:e.target.value})}
          />
        )}
        <button className="btn btn-primary w-100" onClick={addEmployee}>Add</button>
      </div>


      {employees.length === 0 && <Empty />}


      {employees.map(e => (
        <div key={e.id} className="card p-3 mb-3">

          <b>{e.name} ({e.emp_id})</b>
          <small className="text-muted">{e.department}</small>
          <div>Present Days: {e.present_days}</div>

          {/* ⭐ NEW date picker */}
          <input
            type="date"
            max={today}    // ⭐ disables future dates
            className="form-control mb-2"
            value={selectedDate[e.id] || today}
            onChange={(ev) =>
              setSelectedDate({
                ...selectedDate,
                [e.id]: ev.target.value
              })
            }
          />

          <div>
            <button onClick={()=>markAttendance(e.id,"Present")} className="btn btn-success btn-sm me-2">Present</button>
            <button onClick={()=>markAttendance(e.id,"Absent")} className="btn btn-warning btn-sm me-2">Absent</button>
            <button onClick={()=>deleteEmployee(e.id)} className="btn btn-danger btn-sm">Delete</button>
          </div>

          <ul className="mt-2">
            {attendance[e.id]?.map((a,i)=>(
              <li key={i}>{a.date} - {a.status}</li>
            ))}
          </ul>
        </div>
      ))}

    </div>
  )
}
