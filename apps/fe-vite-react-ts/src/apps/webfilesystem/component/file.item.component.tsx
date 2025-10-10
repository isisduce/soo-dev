import React from "react";
import type { WebFileSystem } from "../types/web.file.system.types";
import { FileHelper } from "../helper/file.helper";

interface FileItemProps {
    item: WebFileSystem.FileInfo;
    viewMode: WebFileSystem.ItemViewMode;
    isSelected: boolean;
    onClick: (item: WebFileSystem.FileInfo) => void;
    onDoubleClick: (item: WebFileSystem.FileInfo) => void;
    onSelect: (itemId: string) => void;
    onRangeSelect: (itemId: string) => void;
}

export const FileItemComponent = React.forwardRef<HTMLDivElement, FileItemProps>(({
    item,
    viewMode,
    isSelected,
    onClick,
    onDoubleClick,
    onSelect,
    onRangeSelect,
}, ref) => {
    // drag handler
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
            type: 'file-move',
            sourceItem: item,
            sourcePath: item.path
        }));
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleClick = (e: React.MouseEvent) => {
        if (e.shiftKey) {
            // Shift key is pressed, range selection
            onRangeSelect(item.path);
        } else if (e.ctrlKey || e.metaKey) {
            // Control key is pressed, multi-selection (toggle)
            onSelect(item.path);
        } else {
            // Normal click, single selection
            onClick(item);
        }
    };

    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent file click event when clicking checkbox
        onSelect(item.path);
    };

    const handleDoubleClick = () => {
        onDoubleClick(item);
    };

    switch (viewMode) {
    case 'icon':
        return (
            <div
                ref={ref}
                className={`file-item-icon ${isSelected ? 'selected' : ''}`}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                draggable={true}
                onDragStart={handleDragStart}
            >
                <div className="file-checkbox-container">
                    <input
                        type="checkbox"
                        className="file-checkbox"
                        checked={isSelected}
                        onChange={() => {}} // onChange는 handleCheckboxClick에서 처리
                        onClick={handleCheckboxClick}
                    />
                </div>
                <div className="file-icon-large">
                    {FileHelper.getItemIcon(item)}
                </div>
                <div className="file-name-icon">{item.name}</div>
                <div className="file-size-icon">
                    {item.type === 'file'
                        ? FileHelper.formatFileSize((item).size)
                        : (item as WebFileSystem.FileInfo).modifiedAt
                            ? `directory (${FileHelper.formatDate((item).modifiedAt!).split(' ')[0]})`
                            : 'directory'}
                </div>
            </div>
        );
    case 'list':
        // no break
    case 'detail':
        return (
            <div
                ref={ref}
                className={`file-item-list ${isSelected ? 'selected' : ''}`}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                draggable={true}
                onDragStart={handleDragStart}
            >
                <div className="file-checkbox-container">
                    <input
                        type="checkbox"
                        className="file-checkbox"
                        checked={isSelected}
                        onChange={() => {}} // onChange는 handleCheckboxClick에서 처리
                        onClick={handleCheckboxClick}
                    />
                </div>
                <div className="file-icon">
                    {FileHelper.getItemIcon(item)}
                </div>
                <div className="file-name">{item.name}</div>
                <div className="file-size">
                    {item.type === 'file' ? FileHelper.formatFileSize((item).size) : 'directory'}
                </div>
                <div className="file-date">
                    {FileHelper.formatDate(item.modifiedAt)}
                </div>
            </div>
        );
    default:
        return null;
    }

});
