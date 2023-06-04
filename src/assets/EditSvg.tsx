type EditSvgProps = {
  width: number;
  height: number;
  className?: string;
};

function EditSvg({ width, height, className }: EditSvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enableBackground="new 0 0 24 24"
      version="1.1"
      viewBox="0 0 24 24"
      xmlSpace="preserve"
      width={width}
      height={height}
      className={className}
    >
      <path
        className="fill-green-500"
        d="M19.607 18.746c0 .881-.716 1.624-1.597 1.624H5.231c-.881 0-1.597-.743-1.597-1.624V5.967c0-.881.716-1.571 1.597-1.571h7.454V3.332H5.231c-1.468 0-2.662 1.168-2.662 2.636v12.778c0 1.468 1.194 2.688 2.662 2.688h12.778c1.468 0 2.662-1.221 2.662-2.688v-7.428h-1.065v7.428z"
      ></path>
      <path
        className="fill-green-500"
        d="M20.807 3.17c-.804-.805-2.207-.805-3.012 0l-7.143 7.143a.532.532 0 00-.14.247l-.752 3.011a.535.535 0 00.516.662.518.518 0 00.129-.016l3.012-.753a.527.527 0 00.247-.14l7.143-7.143c.402-.402.624-.937.624-1.506s-.221-1.103-.624-1.505zm-7.791 9.297l-2.008.502.502-2.008 5.909-5.909 1.506 1.506-5.909 5.909zm7.038-7.039l-.376.376-1.506-1.506.376-.376a1.091 1.091 0 011.506 0c.201.201.312.468.312.753s-.111.552-.312.753z"
      ></path>
    </svg>
  );
}

export default EditSvg;
