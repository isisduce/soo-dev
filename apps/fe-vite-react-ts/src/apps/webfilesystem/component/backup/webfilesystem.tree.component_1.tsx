import { Box } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import type { WebFileSystem } from "../../types/web.file.system.types";

interface WebFileSystemTreeComponentProps {
    rootPath?: string;
    currentPath?: string;
    setCurrentPath?: (value: string) => void;
    fileList?: WebFileSystem.FileInfo[];
    showHidden?: boolean;
    showFiles?: boolean;
    fileExtensions?: string[];
    enableMultiSelect?: boolean;
    enableSelectDirectory?: boolean;
    setSelectedFiles?: (files: WebFileSystem.FileInfo[]) => void;
}

export const WebFileSystemTreeComponent: React.FC<WebFileSystemTreeComponentProps> = (props: WebFileSystemTreeComponentProps) => {

    const treeContentRef = useRef<HTMLDivElement>(null);


    // 트리 렌더링 함수
    const renderTree = (rootPath?: string, currentPath?: string) => {
        return (
            <TreeItem
                nodeId="1"
                label="Folder 1"
            >
            </TreeItem >
        )
    };

    // // 트리 내용이 변경될 때 스크롤을 맨 위로 이동
    // useEffect(() => {
    //     if (treeContentRef.current) {
    //         treeContentRef.current.scrollTop = 0;
    //     }
    // }, [directories]);

    // // 디렉토리 및 파일 목록이 없을 때 메시지 표시
    // const isEmpty = useMemo(() => directories.length === 0, [directories]);

    // if (isEmpty) {
    //     return (
    //         <Box
    //             display="flex"
    //             justifyContent="center"
    //             alignItems="center"
    //             height="100%"
    //             color="text.secondary"
    //             sx={{ userSelect: 'none' }}
    //         >
    //             {props.showFiles ? '디렉토리 및 파일이 없습니다.' : '디렉토리가 없습니다.'}
    //         </Box>
    //     );
    // }

    return (
        <Box className="directory-tree">
            <Box className="directory-tree-content" ref={treeContentRef}>
                <TreeView
                    aria-label="file system navigator"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
                >
                    {renderTree(props.rootPath, props.currentPath)}
                </TreeView>
            </Box>
        </Box>
    );
}





// export const WebFileSystemTreeComponent: React.FC<WebFileSystemTreeComponentProps> = (props: WebFileSystemTreeComponentProps) => {

//     const { fileList = [], setCurrentPath, showHidden = false, showFiles = true, fileExtensions = [], enableMultiSelect = false, enableSelectDirectory = false, setSelectedFiles } = props;

//     const [directories, setDirectories] = useState<WebFileSystem.FileInfo[]>([]);
//     const treeContentRef = useRef<HTMLDivElement>(null);

//     // 파일 확장자 필터링 함수
//     // const filterFilesByExtension = (files: WebFileSystem.FileInfo[]) => {
//     //     if (fileExtensions.length === 0) return files;
//     //     return files.filter(file => fileExtensions.includes(file.extension));
//     // };

//     // 디렉토리 및 파일 필터링
//     useEffect(() => {
//         let dirs = fileList.filter(item => item.type === 'directory');
//         if (!showHidden) {
//             dirs = dirs.filter(dir => !dir.isHidden);
//         }
//         let files: WebFileSystem.FileInfo[] = [];
//         if (showFiles) {
//             files = fileList.filter(item => item.type === 'file');
//             if (!showHidden) {
//                 files = files.filter(file => !file.isHidden);
//             }
//             // files = filterFilesByExtension(files);
//         }
//         setDirectories([...dirs, ...files]);
//     }, [fileList, showHidden, showFiles, fileExtensions]);

//     // 트리 렌더링 함수
//     const renderTree = (items: WebFileSystem.FileInfo[]) => {
//         return items.map(item => (
//             <Box
//                 key={item.path}
//                 sx={{
//                     padding: '4px 8px',
//                     cursor: 'pointer',
//                     display: 'flex',
//                     alignItems: 'center',
//                     '&:hover': {
//                         backgroundColor: 'action.hover',
//                     },
//                 }}
//                 onClick={() => {
//                     if (item.type === 'directory' || (enableSelectDirectory && item.type === 'file')) {
//                         setCurrentPath?.(item.path);
//                         setSelectedFiles?.(enableMultiSelect ? [item] : [item]);
//                     }
//                 }}
//             >
//                 <span style={{ marginRight: 8 }}>
//                     {item.type === 'directory' ? '📁' : '📄'}
//                 </span>
//                 <span>{item.name}</span>
//             </Box>
//         ));
//     };

//     // 트리 내용이 변경될 때 스크롤을 맨 위로 이동
//     useEffect(() => {
//         if (treeContentRef.current) {
//             treeContentRef.current.scrollTop = 0;
//         }
//     }, [directories]);

//     // 디렉토리 및 파일 목록이 없을 때 메시지 표시
//     const isEmpty = useMemo(() => directories.length === 0, [directories]);

//     if (isEmpty) {
//         return (
//             <Box
//                 display="flex"
//                 justifyContent="center"
//                 alignItems="center"
//                 height="100%"
//                 color="text.secondary"
//                 sx={{ userSelect: 'none' }}
//             >
//                 {showFiles ? '디렉토리 및 파일이 없습니다.' : '디렉토리가 없습니다.'}
//             </Box>
//         );
//     }

//     return (
//         <div className="directory-tree">
//             <div className="directory-tree-content" ref={treeContentRef}>
//                 {renderTree(directories)}
//             </div>
//         </div>
//     );
// }


// import React, { useEffect, useState } from "react";

// import TreeView from "@mui/lab/TreeView";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import TreeItem from "@mui/lab/TreeItem";

// const TreeViewExample2 = () => {
//   const [treeInfo, setTreeInfo] = useState({});

//   let tmpTreeInfo = {};
//   let nodeId = 0;
//   const appendChild = (arr, info) => {
//     if (arr.child === undefined) arr.child = [];
//     if (arr.child.findIndex((item) => item.label === info) === -1) {
//       arr.child.push({ label: info, nodeId });
//       nodeId++;
//     }
//   };

//   const makeDirectories = (directories) => {
//     tmpTreeInfo = {};
//     for (let d of directories) {
//       let split = d.split("/");
//       let len = split.length;
//       let current = tmpTreeInfo;

//       for (let i = 0; i < len; i++) {
//         appendChild(current, split[i]);
//         current = current.child.find((item) => item.label === split[i]);
//       }
//     }

//     console.log(tmpTreeInfo);
//     setTreeInfo(tmpTreeInfo);
//   };

//   const getFiles = () => {
//     let server = `http://192.168.55.120:3002`;
//     let path = `D:\\github\\globfiles\\**`;
//     fetch(`${server}/useGlob?path=${path}`)
//       .then((res) => res.json())
//       .then((data) => makeDirectories(data.findPath));
//   };

//   const makeTreeItem = (info, parent) => {
//     if (info.child === undefined) return;

//     return info.child.map((item, idx) => (
//       <TreeItem
//         key={idx}
//         nodeId={item.nodeId.toString()}
//         label={item.label}
//         onClick={() => console.log(`${parent}/${item.label}`)}
//       >
//         {makeTreeItem(item, `${parent}/${item.label}`)}
//       </TreeItem>
//     ));
//   };

//   useEffect(() => {
//     getFiles();
//   }, []);

//   return (
//     <div>
//       {/* <button onClick={getFiles}>test</button> */}
//       <TreeView
//         aria-label="file system navigator"
//         defaultCollapseIcon={<ExpandMoreIcon />}
//         defaultExpandIcon={<ChevronRightIcon />}
//         //sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
//       >
//         {makeTreeItem(treeInfo, "")}
//       </TreeView>
//     </div>
//   );
// };

// export default TreeViewExample2;
