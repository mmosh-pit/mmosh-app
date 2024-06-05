import * as React from "react";
import ArrowDown from "@/assets/icons/ArrowDown";
import ArrowUp from "@/assets/icons/ArrowUp";
import { communitiesTopics } from "@/utils/communitiesTopics";
import DeleteIcon from "@/assets/icons/DeleteIcon";

type Props = {
  value: string;
  multi: boolean;
  onChange: (value: string) => void;
  placeholder: string;
  title: string;
  selectedElements: string[];
  onDelete?: (value: string) => void;
  helperText?: string;
};

const CustomSelect = ({
  title,
  placeholder,
  multi,
  onChange,
  onDelete,
  selectedElements,
}: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [displayItems, setDisplayItems] = React.useState(false);
  const animating = React.useRef(false);

  React.useEffect(() => {
    if (!isOpen) {
      animating.current = true;
      setTimeout(() => {
        setDisplayItems(false);
        animating.current = false;
      }, 200);
      return;
    }

    setDisplayItems(true);
  }, [isOpen]);

  const toggleContainer = () => {
    if (animating.current) return;
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col w-full">
      <p className="text-sm text-white">{title}</p>

      <div
        className={`custom-select px-[1vmax] ${!isOpen ? "h-[3vmax]" : "h-[500px]"}`}
      >
        <div
          className="w-full flex justify-between items-center self-center"
          onClick={toggleContainer}
        >
          <div className="flex">
            {selectedElements.length > 0 ? (
              selectedElements.map((element) => (
                <div
                  className="p-2 mx-1 custom-select-item rounded-full"
                  key={element}
                >
                  <p className="text-xs text-white">{element}</p>
                  <div
                    className="p-1 rounded-full custom-select-item-delete"
                    onClick={() => onDelete!(element)}
                  >
                    <DeleteIcon />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-300">{placeholder}</p>
            )}
          </div>

          {isOpen ? <ArrowUp /> : <ArrowDown />}
        </div>
        {displayItems && (
          <div className="custom-select-open">
            <div className="w-full h-[1px] bg-[#6E5FB1] px-2 my-2" />

            {communitiesTopics.map((topic) => {
              if (topic.type === "header") {
                return (
                  <h5 className="my-4 text-gray-200" key={topic.value}>
                    {topic.label}
                  </h5>
                );
              }

              return (
                <div className="flex items-center my-1" key={topic.value}>
                  {multi && (
                    <input
                      id="my-drawer"
                      type="checkbox"
                      className="checkbox mr-2 checked:border-[#645EBE] [--chkbg:theme(#645EBE)]"
                      checked={selectedElements.includes(topic.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onChange(topic.value);
                          return;
                        }

                        onDelete!(topic.value);
                      }}
                    />
                  )}
                  <p className="text-gray-400 text-xs">{topic.label}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
