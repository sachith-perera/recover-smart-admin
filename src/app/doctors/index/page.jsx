"use client";

import { useState, useEffect } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import MasterTemplate from "../../components/master";
import Swal from 'sweetalert2';
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter for redirect

export default function Patients() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const router = useRouter(); // Works with Next.js App Router
  const columnHelper = createColumnHelper();

  // Get token from localStorage
  const token = localStorage.getItem("token");

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("first_name", {
      header: "First Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("last_name", {
      header: "Last Name",
      cell: (info) => info.getValue(),
    }),
    {
      header: "Actions",
      accessorKey: "actions",
      size: 150,
      cell: ({ row }) => (
        <div className="action-buttons">
      
          <button
            className="btn btn-sm btn-warning me-1"
            onClick={() => handleEdit(row.original.id)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDelete(row.original.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Action handlers (implement these according to your needs)
  const handleView = (id) => {
    console.log(`View doctor ${id}`);
    // Add your view logic here (e.g., redirect to doctor details page)
  };

  const handleEdit = (id) => {
    router.push(`/doctors/edit/${id}`); // Redirect to edit page with doctor ID
  };

  const fetchPatients = async () => {
    try {
      setLoading(true);

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctor/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching doctors: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete this. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        // Simulate an API call (replace with your actual delete endpoint)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctor/${id}/`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
       
          Swal.fire({
            title: 'Deleted!',
            text: `record has been deleted successfully.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: true
          });

          setData(data.filter((doctor) => doctor.id !== id)); 

        } else {
          throw new Error('Delete failed');
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'There was a problem deleting the doctor.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <MasterTemplate>
      <div className="row">
        <div className="col-sm-12">
          <div>
            <h1></h1>

            <button style={{float:'right', marginBottom:'10px'}} className="btn btn-primary" > <i className="" ></i> <Link style={{color:'white'}} href="/doctor/create" >Add Doctor</Link> </button>

            {error ? (
              <div className="alert alert-danger mt-3" role="alert">
                <strong>Error: </strong>
                <span>{error}</span>
              </div>
            ) : (
              <div className="mt-3">
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search doctors..."
                      value={globalFilter ?? ""}
                      onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th key={header.id} scope="col">
                              {header.isPlaceholder ? null : (
                                <div
                                  className={
                                    header.column.getCanSort()
                                      ? "cursor-pointer user-select-none"
                                      : ""
                                  }
                                  onClick={header.column.getToggleSortingHandler()}
                                >
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                  <span>
                                    {{
                                      asc: " 🔼",
                                      desc: " 🔽",
                                    }[header.column.getIsSorted()] ?? null}
                                  </span>
                                </div>
                              )}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan={columns.length}
                            className="text-center p-5"
                          >
                            <div className="d-flex justify-content-center align-items-center">
                              <div
                                className="spinner-border text-primary me-2"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </div>
                              <span>Loading doctors...</span>
                            </div>
                          </td>
                        </tr>
                      ) : table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                          <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                              <td key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={columns.length}
                            className="text-center p-5"
                          >
                            No doctors found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    Showing{" "}
                    {table.getState().pagination.pageIndex *
                      table.getState().pagination.pageSize +
                      1}{" "}
                    to{" "}
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) *
                        table.getState().pagination.pageSize,
                      table.getFilteredRowModel().rows.length
                    )}{" "}
                    of {table.getFilteredRowModel().rows.length} doctors
                  </div>
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      Previous
                    </button>
                    <span className="me-2">
                      Page {table.getState().pagination.pageIndex + 1} of{" "}
                      {table.getPageCount()}
                    </span>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MasterTemplate>
  );
}
