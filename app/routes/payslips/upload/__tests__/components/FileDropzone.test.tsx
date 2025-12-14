import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  renderHook,
  act,
} from "@testing-library/react";
import { FileDropzone, useFileDropzone } from "../../components/FileDropzone";

// モック関数をホイストして作成
const mockCreateObjectURL = vi.fn(() => "blob:mock-url");
const mockRevokeObjectURL = vi.fn();

describe("useFileDropzone", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // URL.createObjectURL と revokeObjectURL をモック
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;
  });

  it("初期状態が正しい", () => {
    const { result } = renderHook(() => useFileDropzone());

    expect(result.current.dragActive).toBe(false);
    expect(result.current.selectedFile).toBeNull();
    expect(result.current.previewUrl).toBeNull();
  });

  describe("handleDrag", () => {
    it("dragenter でドラッグ状態がアクティブになる", () => {
      const { result } = renderHook(() => useFileDropzone());

      act(() => {
        const event = {
          type: "dragenter",
          preventDefault: vi.fn(),
          stopPropagation: vi.fn(),
        } as unknown as React.DragEvent;
        result.current.handleDrag(event);
      });

      expect(result.current.dragActive).toBe(true);
    });

    it("dragover でドラッグ状態がアクティブになる", () => {
      const { result } = renderHook(() => useFileDropzone());

      act(() => {
        const event = {
          type: "dragover",
          preventDefault: vi.fn(),
          stopPropagation: vi.fn(),
        } as unknown as React.DragEvent;
        result.current.handleDrag(event);
      });

      expect(result.current.dragActive).toBe(true);
    });

    it("dragleave でドラッグ状態が非アクティブになる", () => {
      const { result } = renderHook(() => useFileDropzone());

      // まずアクティブにする
      act(() => {
        const enterEvent = {
          type: "dragenter",
          preventDefault: vi.fn(),
          stopPropagation: vi.fn(),
        } as unknown as React.DragEvent;
        result.current.handleDrag(enterEvent);
      });

      expect(result.current.dragActive).toBe(true);

      // dragleave で非アクティブに
      act(() => {
        const leaveEvent = {
          type: "dragleave",
          preventDefault: vi.fn(),
          stopPropagation: vi.fn(),
        } as unknown as React.DragEvent;
        result.current.handleDrag(leaveEvent);
      });

      expect(result.current.dragActive).toBe(false);
    });
  });

  describe("handleDrop", () => {
    it("PDF ファイルをドロップするとファイルが選択される（プレビューなし）", () => {
      const { result } = renderHook(() => useFileDropzone());

      const pdfFile = new File(["pdf content"], "test.pdf", {
        type: "application/pdf",
      });

      act(() => {
        const event = {
          preventDefault: vi.fn(),
          stopPropagation: vi.fn(),
          dataTransfer: { files: [pdfFile] },
        } as unknown as React.DragEvent;
        result.current.handleDrop(event);
      });

      expect(result.current.selectedFile).toBe(pdfFile);
      expect(result.current.previewUrl).toBeNull();
      expect(result.current.dragActive).toBe(false);
    });

    it("画像ファイルをドロップするとプレビュー URL が生成される", () => {
      const { result } = renderHook(() => useFileDropzone());

      const imageFile = new File(["image content"], "test.png", {
        type: "image/png",
      });

      act(() => {
        const event = {
          preventDefault: vi.fn(),
          stopPropagation: vi.fn(),
          dataTransfer: { files: [imageFile] },
        } as unknown as React.DragEvent;
        result.current.handleDrop(event);
      });

      expect(result.current.selectedFile).toBe(imageFile);
      expect(result.current.previewUrl).toBe("blob:mock-url");
      expect(mockCreateObjectURL).toHaveBeenCalledWith(imageFile);
    });

    it("許可されていないファイル形式はファイルが選択されない", () => {
      const { result } = renderHook(() => useFileDropzone());

      const textFile = new File(["text content"], "test.txt", {
        type: "text/plain",
      });

      act(() => {
        const event = {
          preventDefault: vi.fn(),
          stopPropagation: vi.fn(),
          dataTransfer: { files: [textFile] },
        } as unknown as React.DragEvent;
        result.current.handleDrop(event);
      });

      expect(result.current.selectedFile).toBeNull();
    });
  });

  describe("handleInputChange", () => {
    it("ファイル選択でファイルが設定される", () => {
      const { result } = renderHook(() => useFileDropzone());

      const jpegFile = new File(["jpeg content"], "test.jpg", {
        type: "image/jpeg",
      });

      act(() => {
        const event = {
          target: { files: [jpegFile] },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        result.current.handleInputChange(event);
      });

      expect(result.current.selectedFile).toBe(jpegFile);
      expect(result.current.previewUrl).toBe("blob:mock-url");
    });
  });

  describe("clearFile", () => {
    it("ファイル選択をクリアできる", () => {
      const { result } = renderHook(() => useFileDropzone());

      // まずファイルを選択
      const imageFile = new File(["image content"], "test.png", {
        type: "image/png",
      });

      act(() => {
        const event = {
          target: { files: [imageFile] },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        result.current.handleInputChange(event);
      });

      expect(result.current.selectedFile).not.toBeNull();

      // クリア
      act(() => {
        result.current.clearFile();
      });

      expect(result.current.selectedFile).toBeNull();
      expect(result.current.previewUrl).toBeNull();
      expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
    });
  });
});

describe("FileDropzone コンポーネント", () => {
  const defaultProps = {
    dragActive: false,
    selectedFile: null,
    previewUrl: null,
    fileInputRef: { current: null },
    onDrag: vi.fn(),
    onDrop: vi.fn(),
    onInputChange: vi.fn(),
    onClearFile: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ファイル未選択時にアップロードエリアを表示する", () => {
    render(<FileDropzone {...defaultProps} />);

    expect(screen.getByText("ファイルをドラッグ&ドロップ")).toBeInTheDocument();
    expect(
      screen.getByText("または クリックしてファイルを選択")
    ).toBeInTheDocument();
    expect(screen.getByText("対応形式: PDF, PNG, JPG")).toBeInTheDocument();
  });

  it("PDF ファイル選択時にファイル名を表示する（プレビューなし）", () => {
    const pdfFile = new File(["pdf content"], "test.pdf", {
      type: "application/pdf",
    });

    render(
      <FileDropzone
        {...defaultProps}
        selectedFile={pdfFile}
        previewUrl={null}
      />
    );

    expect(screen.getByText("test.pdf")).toBeInTheDocument();
    // プレビュー画像は表示されない
    expect(screen.queryByAltText("プレビュー")).not.toBeInTheDocument();
  });

  it("画像ファイル選択時にプレビューを表示する", () => {
    const imageFile = new File(["image content"], "test.png", {
      type: "image/png",
    });

    render(
      <FileDropzone
        {...defaultProps}
        selectedFile={imageFile}
        previewUrl="blob:mock-url"
      />
    );

    expect(screen.getByText("test.png")).toBeInTheDocument();
    const previewImage = screen.getByAltText("プレビュー");
    expect(previewImage).toBeInTheDocument();
    expect(previewImage).toHaveAttribute("src", "blob:mock-url");
  });

  it("ドラッグアクティブ時にスタイルが変わる", () => {
    const { container } = render(
      <FileDropzone {...defaultProps} dragActive={true} />
    );

    const dropzone = container.firstChild;
    expect(dropzone).toHaveClass("border-indigo-500");
  });

  it("クリアボタンをクリックすると onClearFile が呼ばれる", () => {
    const onClearFile = vi.fn();
    const pdfFile = new File(["pdf content"], "test.pdf", {
      type: "application/pdf",
    });

    render(
      <FileDropzone
        {...defaultProps}
        selectedFile={pdfFile}
        onClearFile={onClearFile}
      />
    );

    const clearButton = screen.getByRole("button", {
      name: "ファイル選択をクリア",
    });
    fireEvent.click(clearButton);

    expect(onClearFile).toHaveBeenCalledTimes(1);
  });

  it("ドラッグイベントで onDrag が呼ばれる", () => {
    const onDrag = vi.fn();
    const { container } = render(
      <FileDropzone {...defaultProps} onDrag={onDrag} />
    );

    const dropzone = container.firstChild as HTMLElement;
    fireEvent.dragEnter(dropzone);

    expect(onDrag).toHaveBeenCalled();
  });

  it("ドロップイベントで onDrop が呼ばれる", () => {
    const onDrop = vi.fn();
    const { container } = render(
      <FileDropzone {...defaultProps} onDrop={onDrop} />
    );

    const dropzone = container.firstChild as HTMLElement;
    fireEvent.drop(dropzone);

    expect(onDrop).toHaveBeenCalled();
  });
});
