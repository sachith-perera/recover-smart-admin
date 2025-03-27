"use client"

import MasterTemplate from "../../components/master"
import Swal from "sweetalert2"
import { useState, useEffect } from "react"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import { Bold, Italic, UnderlineIcon, AlignLeft, AlignCenter, AlignRight, List, ListOrdered } from "lucide-react"

// Define Zod schema for checklist validation
const checklistSchema = z.object({
  created_date: z
    .string()
    .nonempty("Created date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  status: z.number().int().min(0, "Status must be a non-negative integer"),
  record: z.number().int().positive("Please select a valid medical record"),
})

// Define Zod schema for checklist item validation
const checklistItemSchema = z.object({
  type: z.number().int().min(1, "Type must be a positive integer"),
  title: z.string().nonempty("Title is required").min(2, "Title must be at least 2 characters"),
  description: z.string().nonempty("Description is required"),
  due_date: z
    .string()
    .nonempty("Due date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  task_status: z.number().int().min(0, "Task status must be a non-negative integer"),
})

// Rich Text Editor component
const RichTextEditor = ({ content, onChange, error }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return <div>Loading editor...</div>
  }

  return (
    <div className={`rich-text-editor ${error ? "is-invalid" : ""}`}>
      <div
        className="menu-bar"
        style={{ marginBottom: "10px", padding: "5px", border: "1px solid #ccc", borderRadius: "4px" }}
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`menu-item btn btn-sm ${editor.isActive("bold") ? "btn-primary" : "btn-outline-secondary"}`}
          style={{ marginRight: "5px" }}
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`menu-item btn btn-sm ${editor.isActive("italic") ? "btn-primary" : "btn-outline-secondary"}`}
          style={{ marginRight: "5px" }}
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`menu-item btn btn-sm ${editor.isActive("underline") ? "btn-primary" : "btn-outline-secondary"}`}
          style={{ marginRight: "5px" }}
        >
          <UnderlineIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`menu-item btn btn-sm ${editor.isActive("bulletList") ? "btn-primary" : "btn-outline-secondary"}`}
          style={{ marginRight: "5px" }}
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`menu-item btn btn-sm ${editor.isActive("orderedList") ? "btn-primary" : "btn-outline-secondary"}`}
          style={{ marginRight: "5px" }}
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`menu-item btn btn-sm ${editor.isActive({ textAlign: "left" }) ? "btn-primary" : "btn-outline-secondary"}`}
          style={{ marginRight: "5px" }}
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`menu-item btn btn-sm ${editor.isActive({ textAlign: "center" }) ? "btn-primary" : "btn-outline-secondary"}`}
          style={{ marginRight: "5px" }}
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`menu-item btn btn-sm ${editor.isActive({ textAlign: "right" }) ? "btn-primary" : "btn-outline-secondary"}`}
        >
          <AlignRight size={16} />
        </button>
      </div>
      <EditorContent
        editor={editor}
        style={{
          border: error ? "1px solid #dc3545" : "1px solid #ced4da",
          borderRadius: "0.25rem",
          padding: "0.375rem 0.75rem",
          minHeight: "200px",
          width: "100%",
          backgroundColor: "#fff",
        }}
      />
      {error && <div className="invalid-feedback d-block">{error}</div>}
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          width: 100%;
          min-height: 200px;
        }
        .ProseMirror p {
          margin: 0.5em 0;
        }
        .ProseMirror:focus {
          outline: none;
          background-color: #fff;
        }
        .ProseMirror p, .ProseMirror h1, .ProseMirror h2, .ProseMirror h3, .ProseMirror li {
          color: #212529;
        }
      `}</style>
      <style jsx global>{`
        .form-control, 
        .form-control:focus,
        select.form-control,
        input.form-control {
          background-color: #fff !important;
          color: #212529 !important;
          opacity: 1;
        }
        
        .form-control:disabled,
        .form-control[readonly] {
          background-color: #e9ecef !important;
        }
        
        select.form-control option {
          color: #212529;
          background-color: #fff;
        }
      `}</style>
    </div>
  )
}

export default function CreateChecklist() {
  const [formData, setFormData] = useState({
    created_date: new Date().toISOString().split("T")[0],
    status: 1,
    record: "",
  })
  const [checklistItems, setChecklistItems] = useState([
    { type: 1, title: "", description: "", due_date: "", task_status: 0 },
  ])
  const [fileUploads, setFileUploads] = useState([]) // Array of arrays for multiple files
  const [records, setRecords] = useState([])
  const [errors, setErrors] = useState({})
  const [itemErrors, setItemErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Fetch medical records for dropdown
  const fetchMedicalRecords = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Authentication token not found")

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medical_record`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error("Error fetching medical records")

      const result = await response.json()
      setRecords(result)
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to load medical records: " + (error.message || "Unknown error"),
      })
    }
  }

  useEffect(() => {
    fetchMedicalRecords()
  }, [])

  const handleChecklistChange = (e) => {
    const { name, value } = e.target
    const updatedValue = name === "status" || name === "record" ? Number.parseInt(value, 10) : value
    setFormData((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }))

    try {
      checklistSchema.parse({ ...formData, [name]: updatedValue })
      setErrors({})
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {}
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message
        })
        setErrors(fieldErrors)
      }
    }
  }

  const handleItemChange = (index, e) => {
    const { name, value } = e.target
    const updatedValue = name === "type" || name === "task_status" ? Number.parseInt(value, 10) : value
    const updatedItems = checklistItems.map((item, i) => (i === index ? { ...item, [name]: updatedValue } : item))
    setChecklistItems(updatedItems)

    try {
      checklistItemSchema.parse(updatedItems[index])
      setItemErrors((prev) => prev.filter((_, i) => i !== index))
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {}
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message
        })
        setItemErrors((prev) => {
          const newErrors = [...prev]
          newErrors[index] = fieldErrors
          return newErrors
        })
      }
    }
  }

  const handleEditorChange = (index, content) => {
    const updatedItems = checklistItems.map((item, i) => (i === index ? { ...item, description: content } : item))
    setChecklistItems(updatedItems)

    try {
      checklistItemSchema.parse({ ...updatedItems[index], description: content })
      setItemErrors((prev) => prev.filter((_, i) => i !== index))
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {}
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message
        })
        setItemErrors((prev) => {
          const newErrors = [...prev]
          newErrors[index] = fieldErrors
          return newErrors
        })
      }
    }
  }

  const handleFileChange = (index, e) => {
    const files = Array.from(e.target.files) // Convert FileList to array
    setFileUploads(prev => {
      const newUploads = [...prev]
      newUploads[index] = files // Store array of files
      return newUploads
    })
  }

  const addChecklistItem = () => {
    setChecklistItems((prev) => [...prev, { type: 1, title: "", description: "", due_date: "", task_status: 0 }])
    setFileUploads((prev) => [...prev, []]) // Add empty array for new item
  }

  const removeChecklistItem = (index) => {
    setChecklistItems((prev) => prev.filter((_, i) => i !== index))
    setItemErrors((prev) => prev.filter((_, i) => i !== index))
    setFileUploads((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      checklistSchema.parse(formData)
      setErrors({})

      checklistItems.forEach((item, index) => {
        checklistItemSchema.parse(item)
      })
      setItemErrors([])

      const token = localStorage.getItem("token")
      if (!token) throw new Error("Authentication token not found")

      setLoading(true)

      // Create checklist
      const checklistResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checklists/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          created_by: 1,
        }),
      })

      if (!checklistResponse.ok) {
        const errorData = await checklistResponse.json()
        throw new Error(errorData.message || "Failed to create checklist")
      }

      const checklistData = await checklistResponse.json()
      const checklistId = checklistData.id

      // Create checklist items and upload files
      const createdItems = []
      for (const [index, item] of checklistItems.entries()) {
        const itemResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checklists/item/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checklist: checklistId,
            ...item,
          }),
        })

        if (!itemResponse.ok) {
          const errorData = await itemResponse.json()
          throw new Error(errorData.message || "Failed to create checklist item")
        }

        const itemData = await itemResponse.json()
        createdItems.push(itemData)

        // Upload multiple files if they exist
        if (fileUploads[index] && fileUploads[index].length > 0) {
          for (const file of fileUploads[index]) {
            const formData = new FormData()
            formData.append("files", file)
            formData.append("id", itemData.id)
            formData.append("entity", "checklist_item")

            const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/attachments`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            })

            if (!uploadResponse.ok) {
              const errorData = await uploadResponse.json()
              throw new Error(errorData.message || "Failed to upload attachment")
            }
          }
        }
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Checklist, items, and attachments created successfully",
        timer: 1500,
        showConfirmButton: true,
      })
      router.push("/checklist/index")
      setFormData({
        created_date: new Date().toISOString().split("T")[0],
        status: 1,
        record: "",
      })
      setChecklistItems([{ type: 1, title: "", description: "", due_date: "", task_status: 0 }])
      setFileUploads([])
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {}
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message
        })
        if (error.errors.some((err) => err.path[0] in formData)) {
          setErrors(fieldErrors)
        } else {
          const index = checklistItems.findIndex((_, i) => error.errors.some((err) => err.path[0] in checklistItems[i]))
          setItemErrors((prev) => {
            const newErrors = [...prev]
            newErrors[index] = fieldErrors
            return newErrors
          })
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong! " + (error.message || "Unknown error"),
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <MasterTemplate>
      <div className="row">
        <div className="col-sm-12">
          <div>
            <h1>Create Checklist</h1>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="created_date" className="form-label">
                  Created Date
                </label>
                <input
                  type="date"
                  className={`form-control ${errors.created_date ? "is-invalid" : ""}`}
                  id="created_date"
                  name="created_date"
                  value={formData.created_date}
                  onChange={handleChecklistChange}
                  required
                />
                {errors.created_date && <div className="invalid-feedback">{errors.created_date}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  className={`form-control ${errors.status ? "is-invalid" : ""}`}
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChecklistChange}
                  required
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
                {errors.status && <div className="invalid-feedback">{errors.status}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="record" className="form-label">
                  Medical Record
                </label>
                <select
                  className={`form-control ${errors.record ? "is-invalid" : ""}`}
                  id="record"
                  name="record"
                  value={formData.record}
                  onChange={handleChecklistChange}
                  required
                >
                  <option value="">Select a medical record</option>
                  {records.map((record) => (
                    <option key={record.id} value={record.id}>
                      {record.id} - {record.patient_full_name || "Unknown Patient"} ({record.diagnosis})
                    </option>
                  ))}
                </select>
                {errors.record && <div className="invalid-feedback">{errors.record}</div>}
              </div>

              <h3>Checklist Items</h3>
              {checklistItems.map((item, index) => (
                <div key={index} className="mb-4 p-3 border rounded">
                  <div className="mb-3">
                    <label htmlFor={`type-${index}`} className="form-label">
                      Type
                    </label>
                    <select
                      className={`form-control ${itemErrors[index]?.type ? "is-invalid" : ""}`}
                      id={`type-${index}`}
                      name="type"
                      value={item.type}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    >
                      <option value={1}>Task</option>
                    </select>
                    {itemErrors[index]?.type && <div className="invalid-feedback">{itemErrors[index].type}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor={`title-${index}`} className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      className={`form-control ${itemErrors[index]?.title ? "is-invalid" : ""}`}
                      id={`title-${index}`}
                      name="title"
                      value={item.title}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    />
                    {itemErrors[index]?.title && <div className="invalid-feedback">{itemErrors[index].title}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor={`description-${index}`} className="form-label">
                      Description
                    </label>
                    <RichTextEditor
                      content={item.description}
                      onChange={(content) => handleEditorChange(index, content)}
                      error={itemErrors[index]?.description}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor={`due_date-${index}`} className="form-label">
                      Due Date
                    </label>
                    <input
                      type="date"
                      className={`form-control ${itemErrors[index]?.due_date ? "is-invalid" : ""}`}
                      id={`due_date-${index}`}
                      name="due_date"
                      value={item.due_date}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    />
                    {itemErrors[index]?.due_date && (
                      <div className="invalid-feedback">{itemErrors[index].due_date}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor={`task_status-${index}`} className="form-label">
                      Task Status
                    </label>
                    <select
                      className={`form-control ${itemErrors[index]?.task_status ? "is-invalid" : ""}`}
                      id={`task_status-${index}`}
                      name="task_status"
                      value={item.task_status}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    >
                      <option value={0}>Pending</option>
                      <option value={1}>In Progress</option>
                      <option value={2}>Completed</option>
                    </select>
                    {itemErrors[index]?.task_status && (
                      <div className="invalid-feedback">{itemErrors[index].task_status}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor={`attachment-${index}`} className="form-label">
                      Attachments (Select multiple files)
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id={`attachment-${index}`}
                      onChange={(e) => handleFileChange(index, e)}
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      multiple // Enable multiple file selection
                    />
                    {/* Display selected file names */}
                    {fileUploads[index] && fileUploads[index].length > 0 && (
                      <div className="mt-2">
                        <small>Selected files: {fileUploads[index].map(file => file.name).join(", ")}</small>
                      </div>
                    )}
                  </div>

                  {checklistItems.length > 1 && (
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removeChecklistItem(index)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button type="button" className="btn btn-success mb-3" onClick={addChecklistItem}>
                + Add Checklist Item
              </button>

              <br />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || Object.keys(errors).length > 0 || itemErrors.some((e) => e)}
              >
                {loading ? "Submitting..." : "Create Checklist"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </MasterTemplate>
  )
}