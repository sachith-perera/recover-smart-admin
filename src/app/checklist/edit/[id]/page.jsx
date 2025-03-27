"use client";

import MasterTemplate from "../../../components/master";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { Bold, Italic, UnderlineIcon, AlignLeft, AlignCenter, AlignRight, List, ListOrdered } from "lucide-react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

// Zod schemas
const checklistSchema = z.object({
  created_date: z.string().nonempty("Created date is required").regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  status: z.number().int().min(0, "Status must be a non-negative integer"),
  record: z.number().int().positive("Please select a valid medical record"),
});

const checklistItemSchema = z.object({
  type: z.number().int().min(1, "Type must be a positive integer"),
  title: z.string().nonempty("Title is required").min(2, "Title must be at least 2 characters"),
  description: z.string().nonempty("Description is required"),
  due_date: z.string().nonempty("Due date is required").regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  task_status: z.number().int().min(0, "Task status must be a non-negative integer"),
});

// RichTextEditor component (unchanged)
const RichTextEditor = ({ content, onChange, error }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return <div>Loading editor...</div>;

  return (
    <div className={`rich-text-editor ${error ? "is-invalid" : ""}`}>
      <div className="menu-bar" style={{ marginBottom: "10px", padding: "5px", border: "1px solid #ccc", borderRadius: "4px" }}>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`menu-item btn btn-sm ${editor.isActive("bold") ? "btn-primary" : "btn-outline-secondary"}`} style={{ marginRight: "5px" }}><Bold size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`menu-item btn btn-sm ${editor.isActive("italic") ? "btn-primary" : "btn-outline-secondary"}`} style={{ marginRight: "5px" }}><Italic size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`menu-item btn btn-sm ${editor.isActive("underline") ? "btn-primary" : "btn-outline-secondary"}`} style={{ marginRight: "5px" }}><UnderlineIcon size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`menu-item btn btn-sm ${editor.isActive("bulletList") ? "btn-primary" : "btn-outline-secondary"}`} style={{ marginRight: "5px" }}><List size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`menu-item btn btn-sm ${editor.isActive("orderedList") ? "btn-primary" : "btn-outline-secondary"}`} style={{ marginRight: "5px" }}><ListOrdered size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={`menu-item btn btn-sm ${editor.isActive({ textAlign: "left" }) ? "btn-primary" : "btn-outline-secondary"}`} style={{ marginRight: "5px" }}><AlignLeft size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={`menu-item btn btn-sm ${editor.isActive({ textAlign: "center" }) ? "btn-primary" : "btn-outline-secondary"}`} style={{ marginRight: "5px" }}><AlignCenter size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} className={`menu-item btn btn-sm ${editor.isActive({ textAlign: "right" }) ? "btn-primary" : "btn-outline-secondary"}`}><AlignRight size={16} /></button>
      </div>
      <EditorContent editor={editor} style={{ border: error ? "1px solid #dc3545" : "1px solid #ced4da", borderRadius: "0.25rem", padding: "0.375rem 0.75rem", minHeight: "200px", width: "100%", backgroundColor: "#fff" }} />
      {error && <div className="invalid-feedback d-block">{error}</div>}
      <style jsx global>{`
        .ProseMirror { outline: none; width: 100%; min-height: 200px; }
        .ProseMirror p { margin: 0.5em 0; }
        .ProseMirror:focus { outline: none; background-color: #fff; }
        .ProseMirror p, .ProseMirror h1, .ProseMirror h2, .ProseMirror h3, .ProseMirror li { color: #212529; }
        .form-control, .form-control:focus, select.form-control, input.form-control { background-color: #fff !important; color: #212529 !important; opacity: 1; }
        .form-control:disabled, .form-control[readonly] { background-color: #e9ecef !important; }
        select.form-control option { color: #212529; background-color: #fff; }
      `}</style>
    </div>
  );
};

// Main component
export default function EditChecklist() {
  const [formData, setFormData] = useState({ created_date: "", status: 0, record: "" });
  const [checklistItems, setChecklistItems] = useState([]);
  const [fileUploads, setFileUploads] = useState({});
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [records, setRecords] = useState([]);
  const [errors, setErrors] = useState({});
  const [itemErrors, setItemErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [token, setToken] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const router = useRouter();
  const { id } = useParams();

  const getStoredToken = () => localStorage.getItem("token");

  const refreshToken = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: localStorage.getItem("refresh_token") }),
      });
      if (!response.ok) throw new Error("Failed to refresh token");
      const data = await response.json();
      const newToken = data.access_token;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      return newToken;
    } catch (error) {
      Swal.fire({ icon: "error", title: "Session Expired", text: "Please log in again." });
      router.push("/login");
      return null;
    }
  };

  const fetchWithAuth = async (url, options = {}) => {
    let authToken = getStoredToken() || token;
    if (!authToken) {
      Swal.fire({ icon: "error", title: "Not Logged In", text: "Please log in to continue." });
      router.push("/login");
      return null;
    }

    options.headers = { ...options.headers, Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" };

    let response = await fetch(url, options);
    if (response.status === 401) {
      authToken = await refreshToken();
      if (!authToken) return null;
      options.headers.Authorization = `Bearer ${authToken}`;
      response = await fetch(url, options);
    }

    if (!response.ok) throw new Error(`Request failed: ${response.statusText}`);
    return response.json();
  };

  const fetchFileAndOpenModal = async (fileId) => {
    try {
      let authToken = getStoredToken() || token;
      if (!authToken) {
        authToken = await refreshToken();
        if (!authToken) throw new Error("Authentication token not found");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/attachments/file?file_id=${fileId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);
      const contentType = response.headers.get("Content-Type");

      setSelectedFileUrl(fileUrl);
      setSelectedFileType(contentType);
      setShowModal(true);
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Failed to load file: " + (error.message || "Unknown error") });
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      const result = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/medical_record`);
      if (result) setRecords(result);
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Failed to load medical records: " + (error.message || "Unknown error") });
    }
  };

  const fetchChecklistData = async () => {
    try {
      const data = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/checklists/record/${id}`);
      if (!data) return;

      setFormData({ created_date: data.created_date, status: data.status, record: data.record });
      setChecklistItems(data.checklistItems);

      const attachmentsPromises = data.checklistItems.map(item =>
        fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/attachments/list?id=${item.id}&entity=checklist_item`)
          .then(res => res || [])
          .catch(err => {
            console.error(err);
            return [];
          })
      );
      const attachmentsResults = await Promise.all(attachmentsPromises);
      setExistingAttachments(attachmentsResults);
      setFileUploads(Object.fromEntries(data.checklistItems.map((_, i) => [i, []])));
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Failed to load checklist: " + (error.message || "Unknown error") });
    }
  };

  useEffect(() => {
    const initialToken = getStoredToken();
    if (!initialToken) {
      Swal.fire({ icon: "error", title: "Not Logged In", text: "Please log in to continue." });
      router.push("/login");
      return;
    }
    setToken(initialToken);
    setIsFetching(true);
    Promise.all([fetchMedicalRecords(), fetchChecklistData()]).finally(() => setIsFetching(false));
  }, [id]);

  const handleCloseModal = () => {
    if (selectedFileUrl) URL.revokeObjectURL(selectedFileUrl);
    setShowModal(false);
    setSelectedFileUrl(null);
    setSelectedFileType(null);
  };

  const handleChecklistChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "status" || name === "record" ? Number.parseInt(value, 10) : value;
    const updatedFormData = { ...formData, [name]: updatedValue };
    setFormData(updatedFormData);
    try {
      checklistSchema.parse(updatedFormData);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.errors.reduce((acc, err) => ({ ...acc, [err.path[0]]: err.message }), {}));
      }
    }
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedValue = name === "type" || name === "task_status" ? Number.parseInt(value, 10) : value;
    const updatedItems = checklistItems.map((item, i) => (i === index ? { ...item, [name]: updatedValue } : item));
    setChecklistItems(updatedItems);
    try {
      checklistItemSchema.parse(updatedItems[index]);
      setItemErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index]; // Remove the error entry if validation passes
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setItemErrors(prev => ({
          ...prev,
          [index]: error.errors.reduce((acc, err) => ({ ...acc, [err.path[0]]: err.message }), {}),
        }));
      }
    }
  };

  const handleEditorChange = (index, content) => {
    const updatedItems = checklistItems.map((item, i) => (i === index ? { ...item, description: content } : item));
    setChecklistItems(updatedItems);
    try {
      checklistItemSchema.parse(updatedItems[index]);
      setItemErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index]; // Remove the error entry if validation passes
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setItemErrors(prev => ({
          ...prev,
          [index]: error.errors.reduce((acc, err) => ({ ...acc, [err.path[0]]: err.message }), {}),
        }));
      }
    }
  };

  const handleFileChange = (index, e) => {
    const files = Array.from(e.target.files);
    setFileUploads(prev => ({ ...prev, [index]: files }));
  };

  const addChecklistItem = () => {
    const newItem = { type: 1, title: "", description: "", due_date: "", task_status: 0 };
    setChecklistItems(prev => [...prev, newItem]);
    setFileUploads(prev => ({ ...prev, [checklistItems.length]: [] }));
    setExistingAttachments(prev => [...prev, []]);
    // Validate new item immediately
    try {
      checklistItemSchema.parse(newItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setItemErrors(prev => ({
          ...prev,
          [checklistItems.length]: error.errors.reduce((acc, err) => ({ ...acc, [err.path[0]]: err.message }), {}),
        }));
      }
    }
  };

  const removeChecklistItem = (index) => {
    setChecklistItems(prev => prev.filter((_, i) => i !== index));
    setItemErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
    setFileUploads(prev => {
      const newUploads = { ...prev };
      delete newUploads[index];
      return newUploads;
    });
    setExistingAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const removeAttachment = async (itemIndex, attachmentId) => {
    try {
      const authToken = token || getStoredToken();
      if (!authToken) throw new Error("Authentication token not found");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/attachments/${attachmentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to delete attachment");
      setExistingAttachments(prev => {
        const newAttachments = [...prev];
        newAttachments[itemIndex] = newAttachments[itemIndex].filter(att => att.id !== attachmentId);
        return newAttachments;
      });
      Swal.fire({ icon: "success", title: "Attachment deleted", timer: 1000 });
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Failed to delete attachment: " + (error.message || "Unknown error") });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      checklistSchema.parse(formData);
      checklistItems.forEach(item => checklistItemSchema.parse(item));
      setErrors({});
      setItemErrors({});

      let authToken = token || getStoredToken();
      if (!authToken) {
        authToken = await refreshToken();
        if (!authToken) throw new Error("Authentication token not found");
      }
      setLoading(true);

      const checklistResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checklists/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, created_by: 1 }),
      });
      if (!checklistResponse.ok) {
        if (checklistResponse.status === 401) {
          authToken = await refreshToken();
          if (!authToken) throw new Error("Authentication failed");
          const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checklists/${id}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, created_by: 1 }),
          });
          if (!retryResponse.ok) throw new Error("Failed to update checklist after retry");
        } else {
          const errorData = await checklistResponse.json();
          throw new Error(errorData.message || "Failed to update checklist");
        }
      }

      for (const [index, item] of checklistItems.entries()) {
        const method = item.id ? "PUT" : "POST";
        const url = item.id
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/checklists/item/${item.id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/checklists/item/`;
        const itemResponse = await fetch(url, {
          method,
          headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
          body: JSON.stringify({ checklist: Number(id), ...item }),
        });
        if (!itemResponse.ok) {
          const errorData = await itemResponse.json();
          throw new Error(errorData.message || "Failed to update/create checklist item");
        }

        const itemData = await itemResponse.json();
        const itemId = item.id || itemData.id;

        if (fileUploads[index]?.length > 0) {
          for (const file of fileUploads[index]) {
            const formData = new FormData();
            formData.append("files", file);
            formData.append("id", itemId);
            formData.append("entity", "checklist_item");
            const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/attachments`, {
              method: "POST",
              headers: { Authorization: `Bearer ${authToken}` },
              body: formData,
            });
            if (!uploadResponse.ok) {
              const errorData = await uploadResponse.json();
              throw new Error(errorData.message || "Failed to upload attachment");
            }
          }
        }
      }

      Swal.fire({ icon: "success", title: "Success!", text: "Checklist updated successfully", timer: 1500 });
      router.push("/checklist/index");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.reduce((acc, err) => {
          const path = err.path[0];
          if (path in formData) acc[path] = err.message;
          else {
            const index = checklistItems.findIndex((_, i) => err.path[0] in checklistItems[i]);
            if (index >= 0) acc.items = { ...acc.items, [index]: { [err.path[0]]: err.message } };
          }
          return acc;
        }, {});
        setErrors(errors);
        setItemErrors(errors.items || {});
      } else {
        Swal.fire({ icon: "error", title: "Oops...", text: "Something went wrong! " + (error.message || "Unknown error") });
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to check if the form is valid
  const isFormValid = () => {
    try {
      checklistSchema.parse(formData);
      checklistItems.forEach(item => checklistItemSchema.parse(item));
      return true;
    } catch (error) {
      return false;
    }
  };

  if (!token) return <MasterTemplate><div>Redirecting to login...</div></MasterTemplate>;
  if (isFetching) return <MasterTemplate><div>Loading checklist data...</div></MasterTemplate>;

  return (
    <MasterTemplate>
      <div className="row">
        <div className="col-sm-12">
          <div>
            <h1>Edit Checklist</h1>
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="created_date" className="form-label">Created Date</label>
                <input type="date" className={`form-control ${errors.created_date ? "is-invalid" : ""}`} id="created_date" name="created_date" value={formData.created_date} onChange={handleChecklistChange} required />
                {errors.created_date && <div className="invalid-feedback">{errors.created_date}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="status" className="form-label">Status</label>
                <select className={`form-control ${errors.status ? "is-invalid" : ""}`} id="status" name="status" value={formData.status} onChange={handleChecklistChange} required>
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
                {errors.status && <div className="invalid-feedback">{errors.status}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="record" className="form-label">Medical Record</label>
                <select className={`form-control ${errors.record ? "is-invalid" : ""}`} id="record" name="record" value={formData.record} onChange={handleChecklistChange} required>
                  <option value="">Select a medical record</option>
                  {records.map(record => (
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
                    <label htmlFor={`type-${index}`} className="form-label">Type</label>
                    <select className={`form-control ${itemErrors[index]?.type ? "is-invalid" : ""}`} id={`type-${index}`} name="type" value={item.type} onChange={e => handleItemChange(index, e)} required>
                      <option value={1}>Task</option>
                    </select>
                    {itemErrors[index]?.type && <div className="invalid-feedback">{itemErrors[index].type}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor={`title-${index}`} className="form-label">Title</label>
                    <input type="text" className={`form-control ${itemErrors[index]?.title ? "is-invalid" : ""}`} id={`title-${index}`} name="title" value={item.title} onChange={e => handleItemChange(index, e)} required />
                    {itemErrors[index]?.title && <div className="invalid-feedback">{itemErrors[index].title}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor={`description-${index}`} className="form-label">Description</label>
                    <RichTextEditor content={item.description} onChange={content => handleEditorChange(index, content)} error={itemErrors[index]?.description} />
                  </div>

                  <div className="mb-3">
                    <label htmlFor={`due_date-${index}`} className="form-label">Due Date</label>
                    <input type="date" className={`form-control ${itemErrors[index]?.due_date ? "is-invalid" : ""}`} id={`due_date-${index}`} name="due_date" value={item.due_date} onChange={e => handleItemChange(index, e)} required />
                    {itemErrors[index]?.due_date && <div className="invalid-feedback">{itemErrors[index].due_date}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor={`task_status-${index}`} className="form-label">Task Status</label>
                    <select className={`form-control ${itemErrors[index]?.task_status ? "is-invalid" : ""}`} id={`task_status-${index}`} name="task_status" value={item.task_status} onChange={e => handleItemChange(index, e)} required>
                      <option value={0}>Pending</option>
                      <option value={1}>In Progress</option>
                      <option value={2}>Completed</option>
                    </select>
                    {itemErrors[index]?.task_status && <div className="invalid-feedback">{itemErrors[index].task_status}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Existing Attachments</label>
                    {existingAttachments[index]?.length > 0 ? (
                      <ul className="list-group mb-2">
                        {existingAttachments[index].map(attachment => (
                          <li key={attachment.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <button
                              type="button"
                              className="btn btn-link p-0"
                              onClick={() => fetchFileAndOpenModal(attachment.id)}
                            >
                              {attachment.url.split('/').pop()}
                            </button>
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeAttachment(index, attachment.id)}>Remove</button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No existing attachments</p>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor={`attachment-${index}`} className="form-label">Add New Attachments (Select multiple files)</label>
                    <input type="file" className="form-control" id={`attachment-${index}`} onChange={e => handleFileChange(index, e)} accept=".pdf,.doc,.docx,.jpg,.png" multiple />
                    {fileUploads[index]?.length > 0 && (
                      <div className="mt-2">
                        <small>Selected files: {fileUploads[index].map(file => file.name).join(", ")}</small>
                      </div>
                    )}
                  </div>

                  {checklistItems.length > 1 && (
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removeChecklistItem(index)}>Remove Item</button>
                  )}
                </div>
              ))}

              <button type="button" className="btn btn-success mb-3" onClick={addChecklistItem}>+ Add Checklist Item</button>
              <br />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !isFormValid()}
              >
                {loading ? "Updating..." : "Update Checklist"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>File Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFileUrl && selectedFileType && (
            <>
              {selectedFileType === "application/pdf" ? (
                <iframe src={selectedFileUrl} width="100%" height="500px" title="PDF Preview" />
              ) : selectedFileType.startsWith("image/") ? (
                <img src={selectedFileUrl} alt="Attachment" style={{ maxWidth: "100%", maxHeight: "500px" }} />
              ) : (
                <p>Unsupported file type for preview. <a href={selectedFileUrl} download>Download instead</a>.</p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </MasterTemplate>
  );
}