import {
  Suspense,
  useEffect,
  useState,
  useRef,
  DragEvent,
  useCallback,
} from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
  fetchQuery,
  useRelayEnvironment,
} from "react-relay";
import {
  CheckCircle2,
  Plus,
  Trash2,
  FileIcon,
  Loader2,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  File as FileGeneric,
  FileText,
  Image,
  X,
  UserPlus,
  UserMinus,
  User,
  Link2,
  Search,
  Link as LinkIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactMarkdown from "react-markdown";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

import { PageTemplate } from "@/components/PageTemplate";
import { MitigationViewSkeleton } from "./MitigationPage";
import { MitigationViewUpdateTaskStateMutation as MitigationViewUpdateTaskStateMutationType } from "./__generated__/MitigationViewUpdateTaskStateMutation.graphql";
import { MitigationViewCreateTaskMutation as MitigationViewCreateTaskMutationType } from "./__generated__/MitigationViewCreateTaskMutation.graphql";
import { MitigationViewDeleteTaskMutation as MitigationViewDeleteTaskMutationType } from "./__generated__/MitigationViewDeleteTaskMutation.graphql";
import { MitigationViewUploadEvidenceMutation as MitigationViewUploadEvidenceMutationType } from "./__generated__/MitigationViewUploadEvidenceMutation.graphql";
import { MitigationViewDeleteEvidenceMutation as MitigationViewDeleteEvidenceMutationType } from "./__generated__/MitigationViewDeleteEvidenceMutation.graphql";
import { MitigationViewAssignTaskMutation as MitigationViewAssignTaskMutationType } from "./__generated__/MitigationViewAssignTaskMutation.graphql";
import { MitigationViewUnassignTaskMutation as MitigationViewUnassignTaskMutationType } from "./__generated__/MitigationViewUnassignTaskMutation.graphql";
import { MitigationViewUpdateMitigationStateMutation as MitigationViewUpdateMitigationStateMutationType } from "./__generated__/MitigationViewUpdateMitigationStateMutation.graphql";
import { MitigationViewQuery as MitigationViewQueryType } from "./__generated__/MitigationViewQuery.graphql";
import { MitigationViewOrganizationQuery$data } from "./__generated__/MitigationViewOrganizationQuery.graphql";
import {
  MitigationViewFrameworksQuery,
  MitigationViewFrameworksQuery$data,
} from "./__generated__/MitigationViewFrameworksQuery.graphql";
import {
  MitigationViewLinkedControlsQuery,
  MitigationViewLinkedControlsQuery$data,
} from "./__generated__/MitigationViewLinkedControlsQuery.graphql";

// Function to format ISO8601 duration to human-readable format
const formatDuration = (isoDuration: string): string => {
  if (!isoDuration || !isoDuration.startsWith("P")) {
    return isoDuration;
  }

  try {
    const durationRegex =
      /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;
    const matches = isoDuration.match(durationRegex);

    if (!matches) return isoDuration;

    const years = matches[1] ? parseInt(matches[1]) : 0;
    const months = matches[2] ? parseInt(matches[2]) : 0;
    const days = matches[3] ? parseInt(matches[3]) : 0;
    const hours = matches[4] ? parseInt(matches[4]) : 0;
    const minutes = matches[5] ? parseInt(matches[5]) : 0;
    const seconds = matches[6] ? parseInt(matches[6]) : 0;

    const parts = [];
    if (years) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
    if (months) parts.push(`${months} ${months === 1 ? "month" : "months"}`);
    if (days) parts.push(`${days} ${days === 1 ? "day" : "days"}`);
    if (hours) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
    if (minutes)
      parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
    if (seconds)
      parts.push(`${seconds} ${seconds === 1 ? "second" : "seconds"}`);

    return parts.length > 0 ? parts.join(", ") : "No duration";
  } catch (error) {
    console.error("Error parsing duration:", error);
    return isoDuration;
  }
};

const mitigationViewQuery = graphql`
  query MitigationViewQuery($mitigationId: ID!) {
    mitigation: node(id: $mitigationId) {
      id
      ... on Mitigation {
        name
        description
        state
        importance
        category
        tasks(first: 100) @connection(key: "MitigationView_tasks") {
          __id
          edges {
            node {
              id
              name
              description
              state
              timeEstimate
              assignedTo {
                id
                fullName
                primaryEmailAddress
              }
              evidences(first: 50)
                @connection(key: "MitigationView_evidences") {
                __id
                edges {
                  node {
                    id
                    mimeType
                    filename
                    size
                    state
                    type
                    url
                    createdAt
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const updateTaskStateMutation = graphql`
  mutation MitigationViewUpdateTaskStateMutation($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      task {
        id
        state
        timeEstimate
      }
    }
  }
`;

const createTaskMutation = graphql`
  mutation MitigationViewCreateTaskMutation(
    $input: CreateTaskInput!
    $connections: [ID!]!
  ) {
    createTask(input: $input) {
      taskEdge @prependEdge(connections: $connections) {
        node {
          id
          name
          description
          timeEstimate
          state
          assignedTo {
            id
            fullName
            primaryEmailAddress
          }
        }
      }
    }
  }
`;

const deleteTaskMutation = graphql`
  mutation MitigationViewDeleteTaskMutation(
    $input: DeleteTaskInput!
    $connections: [ID!]!
  ) {
    deleteTask(input: $input) {
      deletedTaskId @deleteEdge(connections: $connections)
    }
  }
`;

const uploadEvidenceMutation = graphql`
  mutation MitigationViewUploadEvidenceMutation(
    $input: UploadEvidenceInput!
    $connections: [ID!]!
  ) {
    uploadEvidence(input: $input) {
      evidenceEdge @appendEdge(connections: $connections) {
        node {
          id
          filename
          fileUrl
          mimeType
          type
          url
          size
          state
          createdAt
        }
      }
    }
  }
`;

const deleteEvidenceMutation = graphql`
  mutation MitigationViewDeleteEvidenceMutation(
    $input: DeleteEvidenceInput!
    $connections: [ID!]!
  ) {
    deleteEvidence(input: $input) {
      deletedEvidenceId @deleteEdge(connections: $connections)
    }
  }
`;

// Add a GraphQL query to fetch the fileUrl for an evidence item
const getEvidenceFileUrlQuery = graphql`
  query MitigationViewGetEvidenceFileUrlQuery($evidenceId: ID!) {
    node(id: $evidenceId) {
      ... on Evidence {
        id
        fileUrl
      }
    }
  }
`;

const assignTaskMutation = graphql`
  mutation MitigationViewAssignTaskMutation($input: AssignTaskInput!) {
    assignTask(input: $input) {
      task {
        id
        assignedTo {
          id
          fullName
          primaryEmailAddress
        }
      }
    }
  }
`;

const unassignTaskMutation = graphql`
  mutation MitigationViewUnassignTaskMutation($input: UnassignTaskInput!) {
    unassignTask(input: $input) {
      task {
        id
        assignedTo {
          id
          fullName
          primaryEmailAddress
        }
      }
    }
  }
`;

const updateMitigationStateMutation = graphql`
  mutation MitigationViewUpdateMitigationStateMutation(
    $input: UpdateMitigationInput!
  ) {
    updateMitigation(input: $input) {
      mitigation {
        id
        state
      }
    }
  }
`;

const organizationQuery = graphql`
  query MitigationViewOrganizationQuery($organizationId: ID!) {
    organization: node(id: $organizationId) {
      id
      ... on Organization {
        peoples(first: 100, orderBy: { direction: ASC, field: FULL_NAME })
          @connection(key: "MitigationView_peoples") {
          edges {
            node {
              id
              fullName
              primaryEmailAddress
            }
          }
        }
      }
    }
  }
`;

// New queries and mutations for Control Mapping
const frameworksQuery = graphql`
  query MitigationViewFrameworksQuery($organizationId: ID!) {
    organization: node(id: $organizationId) {
      id
      ... on Organization {
        frameworks(first: 100) @connection(key: "Organization__frameworks") {
          edges {
            node {
              id
              name
              controls(first: 100) @connection(key: "Framework__controls") {
                edges {
                  node {
                    id
                    referenceId
                    name
                    description
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const linkedControlsQuery = graphql`
  query MitigationViewLinkedControlsQuery($mitigationId: ID!) {
    mitigation: node(id: $mitigationId) {
      id
      ... on Mitigation {
        controls(first: 100) @connection(key: "Mitigation__controls") {
          edges {
            node {
              id
              referenceId
              name
              description
            }
          }
        }
      }
    }
  }
`;

const createControlMappingMutation = graphql`
  mutation MitigationViewCreateControlMappingMutation(
    $input: CreateControlMappingInput!
  ) {
    createControlMapping(input: $input) {
      success
    }
  }
`;

const deleteControlMappingMutation = graphql`
  mutation MitigationViewDeleteControlMappingMutation(
    $input: DeleteControlMappingInput!
  ) {
    deleteControlMapping(input: $input) {
      success
    }
  }
`;

// Define type for framework structure
type FrameworkEdge = {
  node: {
    id: string;
    name: string;
    controls: {
      edges: Array<{
        node: {
          id: string;
          referenceId: string;
          name: string;
          description?: string;
        };
      }>;
    };
  };
};

type ControlNode = {
  id: string;
  referenceId: string;
  name: string;
  description?: string;
};

function MitigationViewContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<MitigationViewQueryType>;
}) {
  const data = usePreloadedQuery<MitigationViewQueryType>(
    mitigationViewQuery,
    queryRef
  );
  const { toast } = useToast();
  const { organizationId, frameworkId, mitigationId } = useParams();
  const navigate = useNavigate();
  const environment = useRelayEnvironment();

  // Add URLSearchParams handling for task persistence
  const [searchParams, setSearchParams] = useSearchParams();
  const taskIdFromUrl = searchParams.get("taskId");

  // Load organization data for people selector
  const [organizationData, setOrganizationData] =
    useState<MitigationViewOrganizationQuery$data | null>(null);

  // Control mapping state
  const [isControlMappingDialogOpen, setIsControlMappingDialogOpen] =
    useState(false);
  const [frameworksData, setFrameworksData] =
    useState<MitigationViewFrameworksQuery$data | null>(null);
  const [linkedControlsData, setLinkedControlsData] =
    useState<MitigationViewLinkedControlsQuery$data | null>(null);
  const [controlSearchQuery, setControlSearchQuery] = useState("");
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<string | null>(
    null
  );
  const [isLoadingControls, setIsLoadingControls] = useState(false);
  const [isLinkingControl, setIsLinkingControl] = useState(false);
  const [isUnlinkingControl, setIsUnlinkingControl] = useState(false);

  // Create mutation hooks for control mapping
  const [commitCreateControlMapping] = useMutation(
    createControlMappingMutation
  );
  const [commitDeleteControlMapping] = useMutation(
    deleteControlMappingMutation
  );

  useEffect(() => {
    if (organizationId) {
      fetchQuery(environment, organizationQuery, { organizationId }).subscribe({
        next: (data: unknown) => {
          setOrganizationData(data as MitigationViewOrganizationQuery$data);
        },
        error: (error: Error) => {
          console.error("Error fetching organization:", error);
        },
      });
    }
  }, [environment, organizationId]);

  // Load linked controls when component mounts
  useEffect(() => {
    if (mitigationId) {
      fetchQuery(environment, linkedControlsQuery, { mitigationId }).subscribe({
        next: (data: unknown) => {
          setLinkedControlsData(data as MitigationViewLinkedControlsQuery$data);
        },
        error: (error: Error) => {
          console.error("Error fetching linked controls:", error);
        },
      });
    }
  }, [environment, mitigationId]);

  const formatImportance = (importance: string | undefined): string => {
    if (!importance) return "";

    const upperImportance = importance.toUpperCase();

    if (upperImportance === "MANDATORY") return "Mandatory";
    if (upperImportance === "PREFERRED") return "Preferred";
    if (upperImportance === "ADVANCED") return "Advanced";

    const formatted = importance.toLowerCase();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const formatState = (state: string | undefined): string => {
    if (!state) return "";

    const upperState = state.toUpperCase();

    if (upperState === "NOT_STARTED") return "Not Started";
    if (upperState === "IN_PROGRESS") return "In Progress";
    if (upperState === "NOT_APPLICABLE") return "Not Applicable";
    if (upperState === "IMPLEMENTED") return "Implemented";

    const formatted = state.toLowerCase();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const getStateColor = (state: string | undefined): string => {
    if (!state) return "bg-gray-100 text-gray-800";

    const upperState = state.toUpperCase();

    if (upperState === "NOT_STARTED") return "bg-gray-100 text-gray-800";
    if (upperState === "IN_PROGRESS") return "bg-blue-100 text-blue-800";
    if (upperState === "NOT_APPLICABLE") return "bg-purple-100 text-purple-800";
    if (upperState === "IMPLEMENTED") return "bg-green-100 text-green-800";

    return "bg-gray-100 text-gray-800";
  };

  const getImportanceColor = (importance: string | undefined): string => {
    if (!importance) return "bg-gray-100 text-gray-800";

    const upperImportance = importance.toUpperCase();

    if (upperImportance === "MANDATORY") return "bg-red-100 text-red-800";
    if (upperImportance === "PREFERRED") return "bg-orange-100 text-orange-800";
    if (upperImportance === "ADVANCED") return "bg-blue-100 text-blue-800";

    return "bg-gray-100 text-gray-800";
  };

  const [updateTask] = useMutation<MitigationViewUpdateTaskStateMutationType>(
    updateTaskStateMutation
  );
  const [createTask] =
    useMutation<MitigationViewCreateTaskMutationType>(createTaskMutation);
  const [deleteTask] =
    useMutation<MitigationViewDeleteTaskMutationType>(deleteTaskMutation);
  const [uploadEvidence] =
    useMutation<MitigationViewUploadEvidenceMutationType>(
      uploadEvidenceMutation
    );
  const [deleteEvidence] =
    useMutation<MitigationViewDeleteEvidenceMutationType>(
      deleteEvidenceMutation
    );
  const [assignTask] =
    useMutation<MitigationViewAssignTaskMutationType>(assignTaskMutation);
  const [unassignTask] =
    useMutation<MitigationViewUnassignTaskMutationType>(unassignTaskMutation);

  const [updateMitigationState] =
    useMutation<MitigationViewUpdateMitigationStateMutationType>(
      updateMitigationStateMutation
    );

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [timeEstimateDays, setTimeEstimateDays] = useState("");
  const [timeEstimateHours, setTimeEstimateHours] = useState("");
  const [timeEstimateMinutes, setTimeEstimateMinutes] = useState("");

  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [taskForEvidence, setTaskForEvidence] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  const [draggedOverTaskId, setDraggedOverTaskId] = useState<string | null>(
    null
  );
  const [uploadingTaskId, setUploadingTaskId] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // State to track which task's evidence list is expanded
  const [expandedEvidenceTaskId, setExpandedEvidenceTaskId] = useState<
    string | null
  >(null);

  // Add state for the preview modal
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewEvidence, setPreviewEvidence] = useState<{
    id: string;
    filename: string;
    mimeType: string;
    fileUrl?: string;
  } | null>(null);
  const [isLoadingFileUrl, setIsLoadingFileUrl] = useState(false);

  const [isDeleteEvidenceOpen, setIsDeleteEvidenceOpen] = useState(false);
  const [evidenceToDelete, setEvidenceToDelete] = useState<{
    id: string;
    filename: string;
    taskId: string;
  } | null>(null);

  // Add state for people selector
  const [peoplePopoverOpen, setPeoplePopoverOpen] = useState<{
    [key: string]: boolean;
  }>({});

  // Add state for people search
  const [peopleSearch, setPeopleSearch] = useState<{
    [key: string]: string;
  }>({});

  // Add state variables for the evidence dialog and link evidence
  const [evidenceDialogOpen, setEvidenceDialogOpen] = useState(false);
  const [linkEvidenceName, setLinkEvidenceName] = useState("");
  const [linkEvidenceUrl, setLinkEvidenceUrl] = useState("");
  const [linkEvidenceDescription, setLinkEvidenceDescription] = useState("");
  const [activeTab, setActiveTab] = useState<"file" | "link">("file");

  // Add state for selected task panel
  const [selectedTask, setSelectedTask] = useState<(typeof tasks)[0] | null>(
    null
  );

  // Track if task panel is open
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);

  const tasks = data.mitigation.tasks?.edges.map((edge) => edge.node) || [];

  // Add useEffect to handle URL parameters for task selection
  useEffect(() => {
    // If there's a taskId in the URL, find that task and select it
    if (taskIdFromUrl && tasks.length > 0) {
      const taskFromUrl = tasks.find((task) => task.id === taskIdFromUrl);
      if (taskFromUrl) {
        setSelectedTask(taskFromUrl);
        setIsTaskPanelOpen(true);
      } else {
        // If task ID is invalid, remove it from URL
        searchParams.delete("taskId");
        setSearchParams(searchParams);
      }
    }
  }, [taskIdFromUrl, tasks, searchParams, setSearchParams]);

  const getEvidenceConnectionId = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task?.evidences?.__id) {
        return task.evidences.__id;
      }
      return null;
    },
    [tasks]
  );

  // Function to convert days, hours, and minutes to ISO 8601 duration format
  const convertToISODuration = useCallback(() => {
    let duration = "P";

    if (timeEstimateDays && parseInt(timeEstimateDays) > 0) {
      duration += `${parseInt(timeEstimateDays)}D`;
    }

    if (
      (timeEstimateHours && parseInt(timeEstimateHours) > 0) ||
      (timeEstimateMinutes && parseInt(timeEstimateMinutes) > 0)
    ) {
      duration += "T";

      if (timeEstimateHours && parseInt(timeEstimateHours) > 0) {
        duration += `${parseInt(timeEstimateHours)}H`;
      }

      if (timeEstimateMinutes && parseInt(timeEstimateMinutes) > 0) {
        duration += `${parseInt(timeEstimateMinutes)}M`;
      }
    }

    // Return empty string if no time components were provided
    return duration === "P" ? "" : duration;
  }, [timeEstimateDays, timeEstimateHours, timeEstimateMinutes]);

  useEffect(() => {
    const handleDragEnter = (e: globalThis.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types.includes("Files")) {
        setIsDraggingFile(true);
      }
    };

    const handleDragLeave = (e: globalThis.DragEvent) => {
      e.preventDefault();
      // Only set to false if we're leaving the window
      if (!e.relatedTarget || (e.relatedTarget as Node).nodeName === "HTML") {
        setIsDraggingFile(false);
      }
    };

    const handleDragOver = (e: globalThis.DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: globalThis.DragEvent) => {
      e.preventDefault();
      setIsDraggingFile(false);
    };

    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDrop);
    };
  }, []);

  const handleTaskClick = (task: (typeof tasks)[0]) => {
    if (!task) return;
    setSelectedTask(task);
    setIsTaskPanelOpen(true);

    // Add the task ID to URL parameters
    searchParams.set("taskId", task.id);
    setSearchParams(searchParams);
  };

  const handleToggleTaskState = (taskId: string, currentState: string) => {
    const newState = currentState === "DONE" ? "TODO" : "DONE";

    updateTask({
      variables: {
        input: {
          taskId,
          state: newState,
        },
      },
      onCompleted: () => {
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask({
            ...selectedTask,
            state: newState,
          });
        }
      },
      onError: (error) => {
        toast({
          title: "Error updating task",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleCreateTask = () => {
    if (!newTaskName.trim()) {
      toast({
        title: "Error creating task",
        description: "Task name is required",
        variant: "destructive",
      });
      return;
    }

    if (!data.mitigation.id) {
      toast({
        title: "Error creating task",
        description: "Mitigation ID is missing",
        variant: "destructive",
      });
      return;
    }
    // Convert the time estimate components to ISO 8601 format
    const isoTimeEstimate = convertToISODuration();

    createTask({
      variables: {
        connections: [`${data.mitigation.tasks?.__id}`],
        input: {
          mitigationId: data.mitigation.id,
          name: newTaskName,
          description: newTaskDescription,
          timeEstimate: isoTimeEstimate === "" ? null : isoTimeEstimate,
        },
      },
      onCompleted: () => {
        toast({
          title: "Task created",
          description: "New task has been created successfully.",
        });
        setNewTaskName("");
        setNewTaskDescription("");
        setTimeEstimateDays("");
        setTimeEstimateHours("");
        setTimeEstimateMinutes("");
        setIsCreateTaskOpen(false);
      },
      onError: (error) => {
        toast({
          title: "Error creating task",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleDeleteTask = (taskId: string, taskName: string) => {
    setTaskToDelete({ id: taskId, name: taskName });
    setIsDeleteTaskOpen(true);
  };

  const confirmDeleteTask = () => {
    if (!taskToDelete) return;

    deleteTask({
      variables: {
        connections: [`${data.mitigation.tasks?.__id}`],
        input: {
          taskId: taskToDelete.id,
        },
      },
      onCompleted: () => {
        toast({
          title: "Task deleted",
          description: "Task has been deleted successfully.",
        });
        setIsDeleteTaskOpen(false);
        setTaskToDelete(null);
      },
      onError: (error) => {
        toast({
          title: "Error deleting task",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleEditMitigation = () => {
    navigate(
      `/organizations/${organizationId}/frameworks/${frameworkId}/mitigations/${mitigationId}/update`
    );
  };

  const handleUploadEvidence = (taskId: string, taskName: string) => {
    setTaskForEvidence({ id: taskId, name: taskName });
    setEvidenceDialogOpen(true);
    // Reset form fields
    setLinkEvidenceName("");
    setLinkEvidenceUrl("");
    setLinkEvidenceDescription("");
    setActiveTab("file");
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !taskForEvidence)
      return;

    const file = e.target.files[0];

    // Show toast for add started
    toast({
      title: "Adding document",
      description: `Adding ${file.name}...`,
      variant: "default",
    });

    // Get the evidence connection ID for this task
    const evidenceConnectionId = getEvidenceConnectionId(taskForEvidence.id);

    uploadEvidence({
      variables: {
        input: {
          taskId: taskForEvidence.id,
          name: file.name,
          type: "FILE",
          file: null,
          description: "Document evidence",
        },
        connections: evidenceConnectionId ? [evidenceConnectionId] : [],
      },
      uploadables: {
        "input.file": file,
      },
      onCompleted: () => {
        setTaskForEvidence(null);
        // Reset the file input
        if (hiddenFileInputRef.current) {
          hiddenFileInputRef.current.value = "";
        }
      },
      onError: (error) => {
        toast({
          title: "Error adding document",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleLinkEvidenceSubmit = () => {
    if (!taskForEvidence) return;

    // Validate form
    if (!linkEvidenceName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for the evidence",
        variant: "destructive",
      });
      return;
    }

    if (!linkEvidenceUrl.trim()) {
      toast({
        title: "Error",
        description: "Please provide a URL for the evidence",
        variant: "destructive",
      });
      return;
    }

    // Description is now optional for link evidence
    // Remove the validation check for empty description

    // Get the evidence connection ID for this task
    const evidenceConnectionId = getEvidenceConnectionId(taskForEvidence.id);

    // Use a default description if none is provided
    const description =
      linkEvidenceDescription.trim() || `Link to ${linkEvidenceUrl}`;

    uploadEvidence({
      variables: {
        input: {
          taskId: taskForEvidence.id,
          name: linkEvidenceName,
          type: "LINK",
          url: linkEvidenceUrl,
          description: description,
          file: null,
        },
        connections: evidenceConnectionId ? [evidenceConnectionId] : [],
      },
      onCompleted: () => {
        setTaskForEvidence(null);
        setEvidenceDialogOpen(false);
        // Reset form fields
        setLinkEvidenceName("");
        setLinkEvidenceUrl("");
        setLinkEvidenceDescription("");
      },
      onError: (error) => {
        toast({
          title: "Error adding link evidence",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, taskId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedOverTaskId !== taskId) {
      setDraggedOverTaskId(taskId);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverTaskId(null);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>, taskId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverTaskId(null);
    setIsDraggingFile(false);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];
    setUploadingTaskId(taskId);

    // Show toast for add started
    toast({
      title: "Adding document",
      description: `Adding ${file.name}...`,
      variant: "default",
    });

    // Get the evidence connection ID for this task
    const evidenceConnectionId = getEvidenceConnectionId(taskId);

    uploadEvidence({
      variables: {
        input: {
          taskId: taskId,
          name: file.name,
          type: "FILE",
          file: null,
          description: "Document evidence",
        },
        connections: evidenceConnectionId ? [evidenceConnectionId] : [],
      },
      uploadables: {
        "input.file": file,
      },
      onCompleted: () => {
        setUploadingTaskId(null);
        toast({
          title: "Document added",
          description: "Document evidence has been added successfully.",
          variant: "default",
        });
      },
      onError: (error) => {
        setUploadingTaskId(null);
        toast({
          title: "Error adding document",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Function to toggle evidence list expansion
  const toggleEvidenceList = (taskId: string) => {
    if (expandedEvidenceTaskId === taskId) {
      setExpandedEvidenceTaskId(null);
    } else {
      setExpandedEvidenceTaskId(taskId);
    }
  };

  // Function to get file icon based on mime type and evidence type
  const getFileIcon = (mimeType: string, evidenceType: string) => {
    if (evidenceType === "LINK") {
      return <Link2 className="w-4 h-4 text-blue-600" />;
    } else if (mimeType.startsWith("image/")) {
      return <Image className="w-4 h-4 text-blue-500" />;
    } else if (mimeType.includes("pdf")) {
      return <FileText className="w-4 h-4 text-red-500" />;
    } else if (mimeType.includes("word") || mimeType.includes("document")) {
      return <FileText className="w-4 h-4 text-blue-600" />;
    } else if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) {
      return <FileText className="w-4 h-4 text-green-600" />;
    } else {
      return <FileGeneric className="w-4 h-4 text-gray-500" />;
    }
  };

  // Simplified preview handler that opens the modal and sets the evidence
  const handlePreviewEvidence = (evidence: {
    id: string;
    filename: string;
    mimeType: string;
  }) => {
    setPreviewEvidence({
      id: evidence.id,
      filename: evidence.filename,
      mimeType: evidence.mimeType,
    });
    setIsPreviewModalOpen(true);
    setIsLoadingFileUrl(true);
    fetchQuery(environment, getEvidenceFileUrlQuery, {
      evidenceId: evidence.id,
    })
      .toPromise()
      .then((response) => {
        const data = response as { node?: { id: string; fileUrl?: string } };

        if (data?.node?.fileUrl) {
          setPreviewEvidence((prev) => {
            if (!prev) return null;
            return { ...prev, fileUrl: data.node!.fileUrl };
          });
        } else {
          throw new Error("File URL not available in response");
        }
      })
      .catch((error) => {
        console.error("Error fetching file URL:", error);
        toast({
          title: "Error fetching file URL",
          description: error.message || "Could not load the file preview",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoadingFileUrl(false);
      });
  };

  const handleDeleteEvidence = (
    evidenceId: string,
    filename: string,
    taskId: string
  ) => {
    setEvidenceToDelete({ id: evidenceId, filename, taskId });
    setIsDeleteEvidenceOpen(true);
  };

  const confirmDeleteEvidence = () => {
    if (!evidenceToDelete) return;

    const evidenceConnectionId = getEvidenceConnectionId(
      evidenceToDelete.taskId
    );

    deleteEvidence({
      variables: {
        input: {
          evidenceId: evidenceToDelete.id,
        },
        connections: evidenceConnectionId ? [evidenceConnectionId] : [],
      },
      onCompleted: () => {
        setIsDeleteEvidenceOpen(false);
        setEvidenceToDelete(null);
      },
      onError: (error) => {
        toast({
          title: "Error deleting evidence",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  // Function to handle assigning a person to a task
  const handleAssignPerson = (taskId: string, personId: string) => {
    assignTask({
      variables: {
        input: {
          taskId,
          assignedToId: personId,
        },
      },
      onCompleted: () => {
        setPeoplePopoverOpen((prev) => ({ ...prev, [taskId]: false }));
      },
      onError: (error) => {
        toast({
          title: "Error assigning task",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  // Function to handle unassigning a person from a task
  const handleUnassignPerson = (taskId: string) => {
    unassignTask({
      variables: {
        input: {
          taskId,
        },
      },
      onError: (error) => {
        toast({
          title: "Error unassigning task",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  // Function to handle mitigation state change
  const handleMitigationStateChange = (newState: string) => {
    updateMitigationState({
      variables: {
        input: {
          id: data.mitigation.id,
          state: newState as
            | "NOT_STARTED"
            | "IN_PROGRESS"
            | "IMPLEMENTED"
            | "NOT_APPLICABLE",
        },
      },
      onCompleted: () => {
        toast({
          title: "Mitigation state updated",
          description: `Mitigation state has been updated to ${formatState(
            newState
          )}.`,
        });
      },
      onError: (error) => {
        toast({
          title: "Error updating mitigation state",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  // Update SheetContent to handle closing
  const handleCloseTaskPanel = () => {
    setSelectedTask(null);
    setIsTaskPanelOpen(false);
    // Remove taskId from URL when panel is closed
    searchParams.delete("taskId");
    setSearchParams(searchParams);
  };

  // Add state variables for tracking edit mode and duration components
  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [editTimeEstimateDays, setEditTimeEstimateDays] = useState("");
  const [editTimeEstimateHours, setEditTimeEstimateHours] = useState("");
  const [editTimeEstimateMinutes, setEditTimeEstimateMinutes] = useState("");

  // Function to parse ISO duration string into components for editing
  const parseISODuration = useCallback(
    (duration: string | null | undefined) => {
      if (!duration || !duration.startsWith("P")) {
        return { days: "", hours: "", minutes: "" };
      }

      try {
        const durationRegex =
          /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;
        const matches = duration.match(durationRegex);

        if (!matches) return { days: "", hours: "", minutes: "" };

        // We only care about days, hours, and minutes
        const days = matches[3] ? matches[3] : "";
        const hours = matches[4] ? matches[4] : "";
        const minutes = matches[5] ? matches[5] : "";

        return { days, hours, minutes };
      } catch (error) {
        console.error("Error parsing duration:", error);
        return { days: "", hours: "", minutes: "" };
      }
    },
    []
  );

  // Function to handle saving the updated duration
  const handleSaveDuration = useCallback(
    (taskId: string) => {
      // Convert to ISO duration format
      let duration = "P";

      if (editTimeEstimateDays && parseInt(editTimeEstimateDays) > 0) {
        duration += `${parseInt(editTimeEstimateDays)}D`;
      }

      if (
        (editTimeEstimateHours && parseInt(editTimeEstimateHours) > 0) ||
        (editTimeEstimateMinutes && parseInt(editTimeEstimateMinutes) > 0)
      ) {
        duration += "T";

        if (editTimeEstimateHours && parseInt(editTimeEstimateHours) > 0) {
          duration += `${parseInt(editTimeEstimateHours)}H`;
        }

        if (editTimeEstimateMinutes && parseInt(editTimeEstimateMinutes) > 0) {
          duration += `${parseInt(editTimeEstimateMinutes)}M`;
        }
      }

      // If no valid time components were provided, use null (remove the time estimate)
      const timeEstimate = duration === "P" ? null : duration;

      updateTask({
        variables: {
          input: {
            taskId,
            timeEstimate,
          },
        },
        onCompleted: () => {
          setIsEditingDuration(false);

          // Update the selected task state if it's the current task
          if (selectedTask && selectedTask.id === taskId) {
            setSelectedTask({
              ...selectedTask,
              timeEstimate,
            });
          }
        },
        onError: (error) => {
          toast({
            title: "Error updating task",
            description: error.message,
            variant: "destructive",
          });
        },
      });
    },
    [
      editTimeEstimateDays,
      editTimeEstimateHours,
      editTimeEstimateMinutes,
      updateTask,
      toast,
      selectedTask,
      setSelectedTask,
    ]
  );

  // Function to start editing duration
  const startEditingDuration = useCallback(
    (duration: string | null | undefined) => {
      const { days, hours, minutes } = parseISODuration(duration);
      setEditTimeEstimateDays(days);
      setEditTimeEstimateHours(hours);
      setEditTimeEstimateMinutes(minutes);
      setIsEditingDuration(true);
    },
    [parseISODuration]
  );

  // Control mapping functions
  const loadFrameworksAndControls = useCallback(() => {
    if (!organizationId || !mitigationId) return;

    setIsLoadingControls(true);

    // Fetch all frameworks and their controls
    fetchQuery<MitigationViewFrameworksQuery>(environment, frameworksQuery, {
      organizationId,
    }).subscribe({
      next: (data) => {
        setFrameworksData(data);
        if (
          data?.organization?.frameworks?.edges &&
          data.organization.frameworks.edges.length > 0 &&
          !selectedFrameworkId
        ) {
          // Select the first framework by default if none is selected
          const frameworks = data.organization.frameworks.edges;
          if (frameworks[0]?.node?.id) {
            setSelectedFrameworkId(frameworks[0].node.id);
          }
        }
      },
      complete: () => {
        // Fetch already linked controls for this mitigation
        fetchQuery(environment, linkedControlsQuery, {
          mitigationId,
        }).subscribe({
          next: (data: unknown) => {
            setLinkedControlsData(
              data as MitigationViewLinkedControlsQuery$data
            );
            setIsLoadingControls(false);
          },
          error: (error: Error) => {
            console.error("Error fetching linked controls:", error);
            setIsLoadingControls(false);
            toast({
              title: "Error",
              description: "Failed to load linked controls.",
              variant: "destructive",
            });
          },
        });
      },
      error: (error: Error) => {
        console.error("Error fetching frameworks:", error);
        setIsLoadingControls(false);
        toast({
          title: "Error",
          description: "Failed to load frameworks and controls.",
          variant: "destructive",
        });
      },
    });
  }, [environment, mitigationId, organizationId, selectedFrameworkId, toast]);

  const getControls = useCallback(() => {
    if (!frameworksData?.organization?.frameworks?.edges) return [];

    // Get controls from the selected framework
    const frameworks = frameworksData.organization.frameworks
      .edges as Array<FrameworkEdge>;
    if (selectedFrameworkId) {
      const selectedFramework = frameworks.find(
        (edge: FrameworkEdge) => edge.node.id === selectedFrameworkId
      );

      if (selectedFramework?.node?.controls?.edges) {
        return selectedFramework.node.controls.edges.map((edge) => edge.node);
      }
    }

    // If no framework is selected or it doesn't have controls, return controls from all frameworks
    return frameworks.flatMap((framework: FrameworkEdge) =>
      framework.node.controls.edges.map((edge) => edge.node)
    );
  }, [frameworksData, selectedFrameworkId]);

  const getLinkedControls = useCallback(() => {
    if (!linkedControlsData?.mitigation?.controls?.edges) return [];
    return (linkedControlsData.mitigation.controls.edges || []).map(
      (edge) => edge.node
    );
  }, [linkedControlsData]);

  const isControlLinked = useCallback(
    (controlId: string) => {
      const linkedControls = getLinkedControls();
      return linkedControls.some(
        (control: ControlNode) => control.id === controlId
      );
    },
    [getLinkedControls]
  );

  const handleLinkControl = useCallback(
    (controlId: string) => {
      if (!mitigationId) return;

      setIsLinkingControl(true);

      commitCreateControlMapping({
        variables: {
          input: {
            controlId,
            mitigationId,
          },
        },
        onCompleted: (_, errors) => {
          setIsLinkingControl(false);

          if (errors) {
            console.error("Error linking control:", errors);
            toast({
              title: "Error",
              description: "Failed to link control. Please try again.",
              variant: "destructive",
            });
            return;
          }

          // Refresh linked controls data
          fetchQuery<MitigationViewLinkedControlsQuery>(
            environment,
            linkedControlsQuery,
            {
              mitigationId,
            }
          ).subscribe({
            next: (data) => {
              setLinkedControlsData(data);
            },
            error: (error: Error) => {
              console.error("Error refreshing linked controls:", error);
            },
          });

          toast({
            title: "Success",
            description: "Control successfully linked to mitigation.",
          });
        },
        onError: (error) => {
          setIsLinkingControl(false);
          console.error("Error linking control:", error);
          toast({
            title: "Error",
            description: "Failed to link control. Please try again.",
            variant: "destructive",
          });
        },
      });
    },
    [commitCreateControlMapping, environment, mitigationId, toast]
  );

  const handleUnlinkControl = useCallback(
    (controlId: string) => {
      if (!mitigationId) return;

      setIsUnlinkingControl(true);

      commitDeleteControlMapping({
        variables: {
          input: {
            controlId,
            mitigationId,
          },
        },
        onCompleted: (_, errors) => {
          setIsUnlinkingControl(false);

          if (errors) {
            console.error("Error unlinking control:", errors);
            toast({
              title: "Error",
              description: "Failed to unlink control. Please try again.",
              variant: "destructive",
            });
            return;
          }

          // Refresh linked controls data
          fetchQuery(environment, linkedControlsQuery, {
            mitigationId,
          }).subscribe({
            next: (data: unknown) => {
              setLinkedControlsData(
                data as MitigationViewLinkedControlsQuery$data
              );
            },
            error: (error: Error) => {
              console.error("Error refreshing linked controls:", error);
            },
          });

          toast({
            title: "Success",
            description: "Control successfully unlinked from mitigation.",
          });
        },
        onError: (error) => {
          setIsUnlinkingControl(false);
          console.error("Error unlinking control:", error);
          toast({
            title: "Error",
            description: "Failed to unlink control. Please try again.",
            variant: "destructive",
          });
        },
      });
    },
    [commitDeleteControlMapping, environment, mitigationId, toast]
  );

  const handleOpenControlMappingDialog = useCallback(() => {
    loadFrameworksAndControls();
    setIsControlMappingDialogOpen(true);
  }, [loadFrameworksAndControls]);

  const filteredControls = useCallback(() => {
    const controls = getControls();
    if (!controlSearchQuery) return controls;

    const lowerQuery = controlSearchQuery.toLowerCase();
    return controls.filter(
      (control: ControlNode) =>
        control.referenceId.toLowerCase().includes(lowerQuery) ||
        control.name.toLowerCase().includes(lowerQuery) ||
        (control.description &&
          control.description.toLowerCase().includes(lowerQuery))
    );
  }, [controlSearchQuery, getControls]);

  return (
    <PageTemplate
      title={data.mitigation.name ?? ""}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleEditMitigation}>
            Edit Mitigation
          </Button>
          <Select
            defaultValue={data.mitigation.state}
            onValueChange={handleMitigationStateChange}
          >
            <SelectTrigger className="w-[160px] h-8 text-sm">
              <div
                className={`${getStateColor(
                  data.mitigation.state
                )} px-2 py-0.5 rounded-full text-sm w-full text-center`}
              >
                {formatState(data.mitigation.state)}
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NOT_STARTED">Not Started</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="IMPLEMENTED">Implemented</SelectItem>
              <SelectItem value="NOT_APPLICABLE">Not Applicable</SelectItem>
            </SelectContent>
          </Select>
          <div
            className={`${getImportanceColor(
              data.mitigation.importance
            )} px-3 py-1 rounded-full text-sm`}
          >
            {formatImportance(data.mitigation.importance)}
          </div>
        </div>
      }
    >
      <div className="space-y-4 mb-8">
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="prose prose-gray prose-sm md:prose-base text-gray-600 max-w-3xl">
              <ReactMarkdown>{data.mitigation.description}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Mapping Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Controls</h2>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleOpenControlMappingDialog}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Map to Controls</span>
          </Button>
        </div>

        {/* Control Mapping Dialog */}
        <Dialog
          open={isControlMappingDialogOpen}
          onOpenChange={setIsControlMappingDialogOpen}
        >
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Map Mitigation to Controls</DialogTitle>
              <DialogDescription>
                Search and select controls to link to this mitigation. This
                helps track which controls are addressed by this mitigation.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search controls by ID, name, or description..."
                    value={controlSearchQuery}
                    onChange={(e) => setControlSearchQuery(e.target.value)}
                    className="w-full pl-10"
                  />
                </div>
              </div>

              <div className="w-64">
                <Select
                  value={selectedFrameworkId || "all"}
                  onValueChange={(value) =>
                    setSelectedFrameworkId(value === "all" ? null : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Frameworks</SelectItem>
                    {frameworksData?.organization?.frameworks?.edges?.map(
                      (edge) => (
                        <SelectItem key={edge.node.id} value={edge.node.id}>
                          {edge.node.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              {isLoadingControls ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="ml-2">Loading controls...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-[50vh] overflow-y-auto pr-2">
                  {filteredControls().length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No controls found. Try adjusting your search or select a
                      different framework.
                    </div>
                  ) : (
                    filteredControls().map((control) => {
                      const isLinked = isControlLinked(control.id);
                      return (
                        <Card
                          key={control.id}
                          className="border overflow-hidden"
                        >
                          <div
                            className={`p-4 ${isLinked ? "bg-blue-50" : ""}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="font-mono text-sm px-1 py-0.5 rounded-sm bg-lime-100 border border-lime-200 text-lime-800 font-bold">
                                    {control.referenceId}
                                  </div>
                                  {isLinked && (
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-100 text-blue-800 border-blue-200"
                                    >
                                      Linked
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="font-medium">{control.name}</h3>
                                {control.description && (
                                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                    {control.description}
                                  </p>
                                )}
                              </div>
                              <div className="ml-4">
                                {isLinked ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleUnlinkControl(control.id)
                                    }
                                    disabled={isUnlinkingControl}
                                    className="text-red-500 border-red-200 hover:bg-red-50"
                                  >
                                    {isUnlinkingControl ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <X className="w-4 h-4" />
                                    )}
                                    <span className="ml-1">Unlink</span>
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleLinkControl(control.id)
                                    }
                                    disabled={isLinkingControl}
                                    className="text-blue-500 border-blue-200 hover:bg-blue-50"
                                  >
                                    {isLinkingControl ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <LinkIcon className="w-4 h-4" />
                                    )}
                                    <span className="ml-1">Link</span>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            <DialogFooter className="mt-4">
              <Button onClick={() => setIsControlMappingDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Linked Controls List */}
        <Card>
          <CardContent className="p-4">
            {linkedControlsData?.mitigation?.controls?.edges &&
            linkedControlsData.mitigation.controls.edges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getLinkedControls().map((control: ControlNode) => (
                  <Card key={control.id} className="border overflow-hidden">
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-mono text-sm px-1 py-0.5 rounded-sm bg-lime-100 border border-lime-200 text-lime-800 font-bold">
                          {control.referenceId}
                        </div>
                      </div>
                      <h3 className="font-medium text-sm">{control.name}</h3>
                      {control.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {control.description}
                        </p>
                      )}
                      <div className="flex justify-end mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnlinkControl(control.id)}
                          disabled={isUnlinkingControl}
                          className="text-sm h-7 text-red-500 border-red-200 hover:bg-red-50"
                        >
                          Unlink
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No controls linked to this mitigation yet. Click &quot;Map to
                Controls&quot; to link controls.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500 flex items-center bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
              <FileIcon className="w-4 h-4 mr-2 text-blue-500" />
              <span>Drag & drop files onto tasks to add evidence</span>
            </div>
            <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Add a new task to this mitigation. Click save when
                    you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Task Name
                    </label>
                    <Input
                      id="name"
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      placeholder="Enter task name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      Description (optional)
                    </label>
                    <Textarea
                      id="description"
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      placeholder="Enter task description"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="timeEstimate"
                      className="text-sm font-medium"
                    >
                      Time Estimate (optional)
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="days"
                          className="text-xs text-gray-500 block mb-1"
                        >
                          Days
                        </label>
                        <Input
                          id="days"
                          type="number"
                          min="0"
                          value={timeEstimateDays}
                          onChange={(e) => setTimeEstimateDays(e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="hours"
                          className="text-xs text-gray-500 block mb-1"
                        >
                          Hours
                        </label>
                        <Input
                          id="hours"
                          type="number"
                          min="0"
                          max="23"
                          value={timeEstimateHours}
                          onChange={(e) => setTimeEstimateHours(e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="minutes"
                          className="text-xs text-gray-500 block mb-1"
                        >
                          Minutes
                        </label>
                        <Input
                          id="minutes"
                          type="number"
                          min="0"
                          max="59"
                          value={timeEstimateMinutes}
                          onChange={(e) =>
                            setTimeEstimateMinutes(e.target.value)
                          }
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateTaskOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTask}>Create Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className={`space-y-2 ${isDraggingFile ? "space-y-4" : ""}`}>
          {tasks.map((task) => (
            <div
              key={task?.id}
              className="rounded-md overflow-hidden border border-gray-200"
            >
              <div
                className={`flex items-center gap-3 py-4 px-2 hover:bg-gray-50 group relative transition-all duration-200 ${
                  isDraggingFile && draggedOverTaskId !== task?.id
                    ? "border-dashed border-blue-300 bg-blue-50 bg-opacity-30"
                    : ""
                } ${
                  draggedOverTaskId === task?.id
                    ? "bg-blue-50 border-2 border-blue-400 shadow-md"
                    : ""
                } ${
                  selectedTask?.id === task?.id
                    ? "bg-blue-50 border-blue-200"
                    : ""
                }`}
                onClick={() => task && handleTaskClick(task)}
                onDragOver={(e) => task?.id && handleDragOver(e, task.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => task?.id && handleDrop(e, task.id)}
              >
                {isDraggingFile && draggedOverTaskId !== task?.id && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-md z-10">
                    <div className="flex items-center gap-2 text-blue-600 bg-white px-3 py-1.5 rounded-lg shadow-xs">
                      <FileIcon className="w-4 h-4" />
                      <p className="text-sm font-medium">Drop file here</p>
                    </div>
                  </div>
                )}

                {draggedOverTaskId === task?.id && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-md z-10 bg-blue-50 bg-opacity-90 backdrop-blur-sm border-2 border-dashed border-blue-400">
                    <div className="flex items-center gap-2 text-blue-600 bg-white p-5 rounded-lg shadow-md">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <p className="text-sm font-medium text-center">
                        Drop file to add as evidence
                      </p>
                    </div>
                  </div>
                )}

                {uploadingTaskId === task?.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-95 rounded-md z-10 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3 text-blue-600">
                      <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                      <p className="font-medium">Adding document...</p>
                      <p className="text-sm text-gray-500">Please wait</p>
                    </div>
                  </div>
                )}

                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${
                    task?.state === "DONE"
                      ? "border-gray-400 bg-gray-100"
                      : "border-gray-300"
                  } ${isDraggingFile ? "opacity-50" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent task selection when checkbox is clicked
                    if (task?.id && task?.state) {
                      handleToggleTaskState(task.id, task.state);
                    }
                  }}
                >
                  {task?.state === "DONE" && (
                    <CheckCircle2 className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div
                  className={`flex-1 flex items-center justify-between ${
                    isDraggingFile ? "opacity-50" : ""
                  }`}
                >
                  <div>
                    <h3
                      className={`text-sm ${
                        task?.state === "DONE"
                          ? "text-gray-500 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      {task?.name}
                    </h3>
                    {task?.timeEstimate && (
                      <p
                        className={`text-xs mt-1 flex items-center ${
                          task?.state === "DONE"
                            ? "text-gray-400 line-through"
                            : "text-blue-500"
                        }`}
                      >
                        <span className="inline-block w-4 h-4 mr-1">⏱️</span>
                        <span>{formatDuration(task.timeEstimate)}</span>
                      </p>
                    )}
                    {task?.assignedTo && (
                      <p className="text-xs mt-1 flex items-center text-gray-600">
                        <User className="w-3 h-3 mr-1" />
                        <span>{task.assignedTo.fullName}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* People Selector */}
                    <Popover
                      open={peoplePopoverOpen[task?.id || ""]}
                      onOpenChange={(open: boolean) => {
                        if (task?.id) {
                          setPeoplePopoverOpen((prev) => ({
                            ...prev,
                            [task.id]: open,
                          }));
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (task?.id) {
                              setPeoplePopoverOpen((prev) => ({
                                ...prev,
                                [task.id]: !prev[task.id],
                              }));
                            }
                          }}
                        >
                          {task?.assignedTo ? (
                            <UserMinus className="w-4 h-4" />
                          ) : (
                            <UserPlus className="w-4 h-4" />
                          )}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[250px] p-0" align="end">
                        {task?.assignedTo ? (
                          <div className="p-4 space-y-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <div className="text-sm">
                                <p className="font-medium">
                                  {task.assignedTo.fullName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {task.assignedTo.primaryEmailAddress}
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (task?.id) {
                                  handleUnassignPerson(task.id);
                                }
                              }}
                            >
                              <UserMinus className="w-4 h-4 mr-2" />
                              Unassign
                            </Button>
                          </div>
                        ) : (
                          <div className="max-h-[300px] overflow-y-auto">
                            <div className="p-2 border-b">
                              <input
                                type="text"
                                placeholder="Search people to assign..."
                                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={peopleSearch[task?.id || ""] || ""}
                                onChange={(e) => {
                                  if (task?.id) {
                                    setPeopleSearch((prev) => ({
                                      ...prev,
                                      [task.id]: e.target.value,
                                    }));
                                  }
                                }}
                              />
                            </div>
                            <div className="px-3 py-2 text-xs text-gray-500">
                              Click on a person to assign them to this task
                            </div>
                            <div className="py-1">
                              {!organizationData?.organization?.peoples?.edges?.some(
                                (edge) => {
                                  if (!edge?.node) return false;
                                  const searchTerm = (
                                    peopleSearch[task?.id || ""] || ""
                                  ).toLowerCase();
                                  return (
                                    !searchTerm ||
                                    edge.node.fullName
                                      .toLowerCase()
                                      .includes(searchTerm) ||
                                    edge.node.primaryEmailAddress
                                      .toLowerCase()
                                      .includes(searchTerm)
                                  );
                                }
                              ) && (
                                <div className="py-6 text-center text-sm">
                                  No people found.
                                </div>
                              )}
                              {organizationData?.organization?.peoples?.edges?.map(
                                (edge) => {
                                  if (!edge?.node) return null;

                                  const searchTerm = (
                                    peopleSearch[task?.id || ""] || ""
                                  ).toLowerCase();
                                  if (
                                    searchTerm &&
                                    !edge.node.fullName
                                      .toLowerCase()
                                      .includes(searchTerm) &&
                                    !edge.node.primaryEmailAddress
                                      .toLowerCase()
                                      .includes(searchTerm)
                                  ) {
                                    return null;
                                  }

                                  return (
                                    <div
                                      key={edge.node.id}
                                      className="px-2 py-1 hover:bg-blue-50 cursor-pointer"
                                    >
                                      <button
                                        type="button"
                                        className="flex items-center w-full text-left"
                                        onClick={(e) => {
                                          e.stopPropagation(); // Add this line to prevent event bubbling
                                          handleAssignPerson(
                                            task.id,
                                            edge.node.id
                                          );
                                          setPeoplePopoverOpen((prev) => ({
                                            ...prev,
                                            [task.id]: false,
                                          }));
                                        }}
                                      >
                                        <User className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                                        <div>
                                          <p className="font-medium">
                                            {edge.node.fullName}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {edge.node.primaryEmailAddress}
                                          </p>
                                        </div>
                                      </button>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>

                    <button
                      type="button"
                      className="text-gray-400 hover:text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (task?.id && task?.name) {
                          handleUploadEvidence(task.id, task.name);
                        }
                      }}
                      title="Add Evidence"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (task?.id && task?.name) {
                          handleDeleteTask(task.id, task.name);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Evidence section */}
              {task?.evidences?.edges && task.evidences.edges.length > 0 && (
                <>
                  <div
                    className="bg-gray-50 border-t border-gray-200 px-4 py-2.5 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => task.id && toggleEvidenceList(task.id)}
                  >
                    <div className="flex items-center gap-2">
                      <FileIcon className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {task.evidences.edges.length}{" "}
                        {task.evidences.edges.length === 1
                          ? "Evidence"
                          : "Evidences"}
                      </span>
                    </div>
                    {expandedEvidenceTaskId === task.id ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>

                  {expandedEvidenceTaskId === task.id && (
                    <div className="bg-white border-t border-gray-200 p-3 space-y-2.5">
                      {task.evidences.edges.map((edge) => {
                        if (!edge) return null;
                        const evidence = edge.node;
                        if (!evidence) return null;

                        return (
                          <div
                            key={evidence.id}
                            className="flex items-center justify-between p-3 rounded-md border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-white p-2 rounded-md border border-gray-200">
                                {getFileIcon(evidence.mimeType, evidence.type)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-800">
                                  {evidence.filename}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                                  {evidence.type === "FILE" ? (
                                    <>
                                      <span className="font-medium text-gray-600">
                                        {formatFileSize(evidence.size)}
                                      </span>
                                      <span>•</span>
                                    </>
                                  ) : evidence.url ? (
                                    <>
                                      <span className="font-medium text-blue-600 truncate max-w-[200px]">
                                        {evidence.url}
                                      </span>
                                      <span>•</span>
                                    </>
                                  ) : null}
                                  <span>{formatDate(evidence.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {evidence.type === "FILE" ? (
                                <>
                                  {evidence.mimeType.startsWith("image/") ? (
                                    <button
                                      onClick={() =>
                                        handlePreviewEvidence(evidence)
                                      }
                                      className="p-1.5 rounded-full hover:bg-white hover:shadow-sm transition-all"
                                      title="Preview Image"
                                    >
                                      <Eye className="w-4 h-4 text-blue-600" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handlePreviewEvidence(evidence);
                                      }}
                                      className="p-1.5 rounded-full hover:bg-white hover:shadow-sm transition-all"
                                      title="Download"
                                    >
                                      <Download className="w-4 h-4 text-blue-600" />
                                    </button>
                                  )}
                                </>
                              ) : evidence.url ? (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (evidence.url) {
                                      window.open(evidence.url, "_blank");
                                    }
                                  }}
                                  className="p-1.5 rounded-full hover:bg-white hover:shadow-sm transition-all"
                                  title="Open Link"
                                >
                                  <Link2 className="w-4 h-4 text-blue-600" />
                                </button>
                              ) : null}
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (task?.id) {
                                    handleDeleteEvidence(
                                      evidence.id,
                                      evidence.filename,
                                      task.id
                                    );
                                  }
                                }}
                                className="p-1.5 rounded-full hover:bg-red-50 hover:shadow-sm transition-all"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No tasks yet. Click &quot;Add Task&quot; to create one.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right task panel */}
      <Sheet open={isTaskPanelOpen} onOpenChange={handleCloseTaskPanel}>
        <SheetContent
          side="right"
          className="!max-w-[50vw] !w-[50vw] p-0 overflow-y-auto"
        >
          {selectedTask && (
            <div className="flex flex-col h-full">
              <SheetHeader className="px-6 py-4 border-b sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-xl font-semibold">
                    {selectedTask.name}
                  </SheetTitle>
                  <SheetClose className="rounded-full p-1 hover:bg-gray-100">
                    <X className="h-5 w-5" />
                  </SheetClose>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-auto p-6 space-y-6">
                {/* Task name and state */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        selectedTask.state === "DONE"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {selectedTask.state === "DONE"
                        ? "Completed"
                        : "In Progress"}
                    </div>
                    {!isEditingDuration ? (
                      <div
                        className="text-sm text-gray-500 flex items-center hover:bg-gray-100 px-2 py-1 rounded-md cursor-pointer"
                        onClick={() =>
                          startEditingDuration(selectedTask.timeEstimate)
                        }
                      >
                        <span className="inline-block w-4 h-4 mr-1">⏱️</span>
                        <span>
                          {selectedTask.timeEstimate
                            ? formatDuration(selectedTask.timeEstimate)
                            : "Add time estimate"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            value={editTimeEstimateDays}
                            onChange={(e) =>
                              setEditTimeEstimateDays(e.target.value)
                            }
                            className="w-12 p-1 text-xs border rounded"
                            placeholder="0"
                          />
                          <span className="text-xs text-gray-500">d</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="23"
                            value={editTimeEstimateHours}
                            onChange={(e) =>
                              setEditTimeEstimateHours(e.target.value)
                            }
                            className="w-12 p-1 text-xs border rounded"
                            placeholder="0"
                          />
                          <span className="text-xs text-gray-500">h</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={editTimeEstimateMinutes}
                            onChange={(e) =>
                              setEditTimeEstimateMinutes(e.target.value)
                            }
                            className="w-12 p-1 text-xs border rounded"
                            placeholder="0"
                          />
                          <span className="text-xs text-gray-500">m</span>
                        </div>
                        <button
                          className="p-1 text-sm text-blue-600 hover:text-blue-800"
                          onClick={() => handleSaveDuration(selectedTask.id)}
                        >
                          Save
                        </button>
                        <button
                          className="p-1 text-sm text-gray-500 hover:text-gray-700"
                          onClick={() => setIsEditingDuration(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Task description */}
                {selectedTask.description && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-600">
                      Description
                    </h3>
                    <div className="prose prose-sm max-w-none p-3 bg-gray-50 rounded-md border border-gray-100">
                      <ReactMarkdown>{selectedTask.description}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Assigned person */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-600">
                    Assignment
                  </h3>
                  {selectedTask.assignedTo ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-700 rounded-full p-2">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {selectedTask.assignedTo.fullName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {selectedTask.assignedTo.primaryEmailAddress}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnassignPerson(selectedTask.id)}
                        className="flex items-center gap-1"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                        <span>Unassign</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-100">
                      <p className="text-gray-500">
                        No one is assigned to this task
                      </p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Assign</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-0">
                          <div className="p-2 border-b">
                            <input
                              type="text"
                              placeholder="Search people..."
                              className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={peopleSearch[selectedTask.id || ""] || ""}
                              onChange={(e) => {
                                setPeopleSearch((prev) => ({
                                  ...prev,
                                  [selectedTask.id]: e.target.value,
                                }));
                              }}
                            />
                          </div>
                          <div className="py-1 max-h-[200px] overflow-y-auto">
                            {organizationData?.organization?.peoples?.edges?.map(
                              (edge) => {
                                if (!edge?.node) return null;

                                const searchTerm = (
                                  peopleSearch[selectedTask.id || ""] || ""
                                ).toLowerCase();
                                if (
                                  searchTerm &&
                                  !edge.node.fullName
                                    .toLowerCase()
                                    .includes(searchTerm) &&
                                  !edge.node.primaryEmailAddress
                                    .toLowerCase()
                                    .includes(searchTerm)
                                ) {
                                  return null;
                                }

                                return (
                                  <div
                                    key={edge.node.id}
                                    className="px-2 py-1 hover:bg-blue-50 cursor-pointer"
                                  >
                                    <button
                                      type="button"
                                      className="flex items-center w-full text-left"
                                      onClick={(e) => {
                                        e.stopPropagation(); // Add this line to prevent event bubbling
                                        handleAssignPerson(
                                          selectedTask.id,
                                          edge.node.id
                                        );
                                      }}
                                    >
                                      <User className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                                      <div>
                                        <p className="font-medium">
                                          {edge.node.fullName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {edge.node.primaryEmailAddress}
                                        </p>
                                      </div>
                                    </button>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>

                {/* Evidence section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-600">
                      Evidence
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleUploadEvidence(selectedTask.id, selectedTask.name)
                      }
                      className="flex items-center gap-1 text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Evidence</span>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {selectedTask.evidences?.edges &&
                    selectedTask.evidences.edges.length > 0 ? (
                      selectedTask.evidences.edges.map((edge) => {
                        if (!edge) return null;
                        const evidence = edge.node;
                        if (!evidence) return null;

                        return (
                          <div
                            key={evidence.id}
                            className="flex items-center justify-between p-3 rounded-md border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-white p-2 rounded-md border border-gray-200">
                                {getFileIcon(evidence.mimeType, evidence.type)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-800">
                                  {evidence.filename}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                                  {evidence.type === "FILE" ? (
                                    <>
                                      <span className="font-medium text-gray-600">
                                        {formatFileSize(evidence.size)}
                                      </span>
                                      <span>•</span>
                                    </>
                                  ) : evidence.url ? (
                                    <>
                                      <span className="font-medium text-blue-600 truncate max-w-[200px]">
                                        {evidence.url}
                                      </span>
                                      <span>•</span>
                                    </>
                                  ) : null}
                                  <span>{formatDate(evidence.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {evidence.type === "FILE" ? (
                                <>
                                  {evidence.mimeType.startsWith("image/") ? (
                                    <button
                                      onClick={() =>
                                        handlePreviewEvidence(evidence)
                                      }
                                      className="p-1.5 rounded-full hover:bg-white hover:shadow-sm transition-all"
                                      title="Preview Image"
                                    >
                                      <Eye className="w-4 h-4 text-blue-600" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handlePreviewEvidence(evidence);
                                      }}
                                      className="p-1.5 rounded-full hover:bg-white hover:shadow-sm transition-all"
                                      title="Download"
                                    >
                                      <Download className="w-4 h-4 text-blue-600" />
                                    </button>
                                  )}
                                </>
                              ) : evidence.url ? (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (evidence.url) {
                                      window.open(evidence.url, "_blank");
                                    }
                                  }}
                                  className="p-1.5 rounded-full hover:bg-white hover:shadow-sm transition-all"
                                  title="Open Link"
                                >
                                  <Link2 className="w-4 h-4 text-blue-600" />
                                </button>
                              ) : null}
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteEvidence(
                                    evidence.id,
                                    evidence.filename,
                                    selectedTask.id
                                  );
                                }}
                                className="p-1.5 rounded-full hover:bg-red-50 hover:shadow-sm transition-all"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-6 bg-gray-50 rounded-md border border-dashed border-gray-200">
                        <FileIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          No evidence attached yet
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Upload files or add links to provide evidence
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Task actions */}
              <div className="border-t p-4 sticky bottom-0 bg-white">
                <div className="flex gap-3 justify-end">
                  {selectedTask.state !== "DONE" ? (
                    <Button
                      variant="default"
                      className="flex items-center gap-1"
                      onClick={() =>
                        handleToggleTaskState(
                          selectedTask.id,
                          selectedTask.state || "TODO"
                        )
                      }
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Complete</span>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() =>
                        handleToggleTaskState(
                          selectedTask.id,
                          selectedTask.state || "DONE"
                        )
                      }
                    >
                      <X className="w-4 h-4" />
                      <span>Reopen Task</span>
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    className="flex items-center gap-1"
                    onClick={() => {
                      handleDeleteTask(selectedTask.id, selectedTask.name);
                      handleCloseTaskPanel();
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Task</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Evidence Add Dialog */}
      <Dialog open={evidenceDialogOpen} onOpenChange={setEvidenceDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add Evidence</DialogTitle>
            <DialogDescription>
              Choose the type of evidence you want to add to this task.
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={(value: string) =>
              setActiveTab(value as "file" | "link")
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file">Document</TabsTrigger>
              <TabsTrigger value="link">Link</TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4">
              <div className="space-y-4 pt-4">
                <p>Select a document to add as evidence.</p>
                <Button
                  onClick={() => {
                    if (hiddenFileInputRef.current) {
                      hiddenFileInputRef.current.click();
                      setEvidenceDialogOpen(false);
                    }
                  }}
                  className="w-full"
                >
                  Select Document
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="link" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="evidence-name">Name</Label>
                  <Input
                    id="evidence-name"
                    value={linkEvidenceName}
                    onChange={(e) => setLinkEvidenceName(e.target.value)}
                    placeholder="Name for this evidence"
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="evidence-url">URL</Label>
                  <Input
                    id="evidence-url"
                    value={linkEvidenceUrl}
                    onChange={(e) => setLinkEvidenceUrl(e.target.value)}
                    placeholder="https://example.com"
                    type="url"
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="evidence-description">
                    Description (optional)
                  </Label>
                  <Textarea
                    id="evidence-description"
                    value={linkEvidenceDescription}
                    onChange={(e) => setLinkEvidenceDescription(e.target.value)}
                    placeholder="Describe this evidence (optional)"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEvidenceDialogOpen(false)}
            >
              Cancel
            </Button>
            {activeTab === "link" && (
              <Button onClick={handleLinkEvidenceSubmit}>Add Link</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden file input for direct uploads */}
      <input
        type="file"
        ref={hiddenFileInputRef}
        onChange={handleFileSelected}
        style={{ display: "none" }}
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
      />

      {/* Delete Task Confirmation Dialog */}
      <Dialog open={isDeleteTaskOpen} onOpenChange={setIsDeleteTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the task &quot;
              {taskToDelete?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteTaskOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteTask}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add the Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{previewEvidence?.filename}</span>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </DialogTitle>
            <DialogDescription>
              Preview of the evidence file. You can view or download the file
              from here.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-50 rounded-md p-4">
            {isLoadingFileUrl ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-gray-500">Loading preview...</p>
              </div>
            ) : previewEvidence?.fileUrl ? (
              previewEvidence.mimeType.startsWith("image/") ? (
                <img
                  src={previewEvidence.fileUrl}
                  alt={previewEvidence.filename}
                  className="max-h-[70vh] object-contain"
                />
              ) : previewEvidence.mimeType.includes("pdf") ? (
                <iframe
                  src={previewEvidence.fileUrl}
                  className="w-full h-[70vh]"
                  title={previewEvidence.filename}
                />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <FileGeneric className="w-16 h-16 text-gray-400" />
                  <p className="text-gray-600">
                    Preview not available for this file type
                  </p>
                  <Button
                    onClick={() => {
                      if (previewEvidence?.fileUrl) {
                        window.open(previewEvidence.fileUrl, "_blank");
                      }
                    }}
                  >
                    Download File
                  </Button>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center gap-2">
                <FileGeneric className="w-12 h-12 text-gray-400" />
                <p className="text-gray-500">Failed to load preview</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPreviewModalOpen(false)}
            >
              Close
            </Button>
            {previewEvidence?.fileUrl && (
              <Button
                onClick={() => {
                  if (previewEvidence?.fileUrl) {
                    window.open(previewEvidence.fileUrl, "_blank");
                  }
                }}
              >
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Delete Evidence Confirmation Dialog */}
      <Dialog
        open={isDeleteEvidenceOpen}
        onOpenChange={setIsDeleteEvidenceOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Evidence</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the evidence &quot;
              {evidenceToDelete?.filename}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteEvidenceOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteEvidence}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
}

export default function MitigationView() {
  const { mitigationId } = useParams();
  const [queryRef, loadQuery] =
    useQueryLoader<MitigationViewQueryType>(mitigationViewQuery);

  useEffect(() => {
    if (mitigationId) {
      loadQuery({ mitigationId });
    }
  }, [mitigationId, loadQuery]);

  if (!queryRef) {
    return <MitigationViewSkeleton />;
  }

  return (
    <Suspense fallback={<MitigationViewSkeleton />}>
      <MitigationViewContent queryRef={queryRef} />
    </Suspense>
  );
}
