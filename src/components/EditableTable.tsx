import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
    type VisibilityState,
    type ColumnDef,
    type CellContext,
} from "@tanstack/react-table";
import { useState } from "react";

// ----------Factory methods for creating editable cells, these were tricky----------

/**
 * Creates a string column for a table with an editable input cell.
 * @template T - Type of table row
 * @param columnHelper - Column helper from react-table
 * @param accessor - Key of the data object
 * @param header - Column header text
 * @param onCommit - Callback when editing is committed
 * @returns ColumnDef for a string column
 */
export function createStringColumn<T extends object>(
    columnHelper: ReturnType<typeof createColumnHelper<T>>,
    accessor: keyof T & string,
    header: string,
    onCommit: (rowIndex: number, key: keyof T, value: string) => void
) {
    return columnHelper.accessor((row: T) => row[accessor], {
        header,
        cell: (info) => {
            const [value, setValue] = useState(info.getValue() as string);

            return (
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={() => onCommit(info.row.index, accessor, value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter")
                            onCommit(info.row.index, accessor, value);
                    }}
                    className="px-1 py-1 md:w-full"
                />
            );
        },
    });
}

/**
 * Creates a string column with optional boolean validation.
 * If `validateBoolean` is true, only "true" or "false" are accepted.
 * @template T - Type of table row
 * @param columnHelper - Column helper from react-table
 * @param accessor - Key of the data object
 * @param header - Column header text
 * @param onCommit - Callback when editing is committed
 * @returns ColumnDef for a string column
 */
export function createBooleanStringColumn<T extends object>(
    columnHelper: ReturnType<typeof createColumnHelper<T>>,
    accessor: keyof T & string,
    header: string,
    onCommit: (rowIndex: number, key: keyof T, value: string) => void,
    validateBoolean = false
) {
    return columnHelper.accessor((row: T) => row[accessor], {
        header,
        cell: (info: CellContext<T, any>) => {
            const [value, setValue] = useState(info.getValue() as string);
            const [isError, setIsError] = useState(false);

            const commit = () => {
                if (!isError) onCommit(info.row.index, accessor, value);
            };

            return (
                <input
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value)
                    }}
                    onBlur={() => {
                        if (value) {
                            if (value === "true" || value === "false") {
                                setIsError(false);
                                setValue(value);
                            } else {
                                setIsError(true);
                            }
                        } else {
                            setValue(value);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") commit();
                    }}
                    className={`px-1 py-1 md:w-full ${
                        isError ? "bg-red-400" : ""
                    }`}
                />
            );
        },
    });
}

/**
 * Creates a number column for a table with an editable input cell.
 * Includes basic validation for non-negative numbers.
 * @template T - Type of table row
 * @param columnHelper - Column helper from react-table
 * @param accessor - Key of the data object
 * @param header - Column header text
 * @param onCommit - Callback when editing is committed
 * @returns ColumnDef for a number column
 */
export function createNumberColumn<T extends object>(
    columnHelper: ReturnType<typeof createColumnHelper<T>>,
    accessor: keyof T & string,
    header: string,
    onCommit: (rowIndex: number, key: keyof T, value: number) => void
) {
    return columnHelper.accessor((row: T) => row[accessor], {
        header,
        cell: (info) => {
            const [value, setValue] = useState(info.getValue() as number);
            const [isInputError, setIsInputError] = useState<boolean>(false);

            return (
                <input
                    value={value}
                    onChange={(e) => {
                        const numberValue = Number(e.currentTarget.value);
                        if (
                            numberValue !== null &&
                            !Number.isNaN(numberValue) &&
                            numberValue >= 0
                        ) {
                            setIsInputError(false);
                            setValue(numberValue);
                        } else {
                            setIsInputError(true);
                        }
                    }}
                    onBlur={() => {
                        setValue(value);
                        onCommit(info.row.index, accessor, value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            setValue(value);
                            onCommit(info.row.index, accessor, value);
                        }
                    }}
                    className={`px-1 h-full md:w-full ${
                        isInputError ? "bg-red-400" : ""
                    }`}
                />
            );
        },
    });
}

/**
 * Creates a delete column for a table with a button to remove a row.
 * @template T - Type of table row
 * @param columnHelper - Column helper from react-table
 * @param onDelete - Callback to delete the row
 * @returns ColumnDef for a delete column
 */
export function createDeleteColumn<T extends object>(
    columnHelper: ReturnType<typeof createColumnHelper<T>>,
    onDelete: (rowIndex: number) => void
) {
    return columnHelper.display({
        id: "delete",
        header: "Action",
        cell: (info: CellContext<T, unknown>) => {
            const rowIndex = info.row.index;
            return (
                <button
                    onClick={() => onDelete(rowIndex)}
                    className="hover:cursor-pointer flex justify-center w-full hover:brightness- transition-all ease-in"
                >
                    <span className="sr-only">Delete row</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5V4h3a.75.75 0 0 1 0 1.5h-.5v7A2.5 2.5 0 0 1 10 15H6a2.5 2.5 0 0 1-2.5-2.5v-7H3A.75.75 0 1 1 3 4h3v-.5ZM6.75 6a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 0 1.5 0V6Zm4 0a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 0 1.5 0V6Z" />
                    </svg>
                </button>
            );
        },
    });
}

//-------------------------------------------------------------

/**
 * Props for the EditableTable component
 */
interface EditableTableProps<T extends object> {
    data: T[];
    columns: ColumnDef<T, any>[]; // typed per use case
    onChange?: (data: T[]) => void;
    onAddRow?: () => void; // optional callback to add a row
}

/**
 * EditableTable component
 *
 * Displays a table with:
 * - Column visibility toggles
 * - Sticky headers
 * - Editable cells for strings and numbers
 * - Optional row addition and deletion
 *
 * @template T - Type of the row objects
 * @param data - Array of row data
 * @param columns - Column definitions
 * @param onChange - Callback when data changes
 * @param onAddRow - Optional callback to add a new row
 */
export function EditableTable<T extends object>({
    data,
    columns,
    onAddRow,
}: EditableTableProps<T>) {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            columnVisibility,
        },
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="flex flex-col bg-inner-panel-grey editable-table-scrollbar">
            {/* column toggle cells */}
            <div className="flex mt-2 w-full justify-between sticky top-0 z-10 bg-inner-panel-grey pb-2">
                <div className="flex gap-4 flex-wrap">
                    {table.getAllLeafColumns().map((column) =>
                        column.id !== "delete" ? (
                            <label
                                key={column.id}
                                className="flex items-center gap-1 "
                            >
                                <input
                                    type="checkbox"
                                    checked={column.getIsVisible()}
                                    onChange={column.getToggleVisibilityHandler()}
                                />
                                {column.id}
                            </label>
                        ) : null
                    )}
                </div>
                {onAddRow && (
                    <button
                        className="p-2 border rounded hover:cursor-pointer bg-card-black hover:bg-highlight-grey"
                        onClick={onAddRow}
                    >
                        Add Row
                    </button>
                )}
            </div>

            {/* table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse border-b-[0.8px]">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="border-[0.8px] bg-card-black z-5"
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className={`${
                                            row.index % 2 === 0
                                                ? "bg-sidebar-black"
                                                : "bg-inner-panel-grey"
                                        } border-x-[0.8px]`}
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
