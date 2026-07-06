import logo from "../../../assets/xebia-logo.png";

export default function Logo() {
  return (
    <div className="flex items-center justify-center py-6">
      <img
        src={logo}
        alt="Xebia LMS"
        className="h-12 w-auto object-contain"
      />
    </div>
  );
}