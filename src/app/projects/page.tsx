"use client";
import ProjectCard from "@/app/components/Project/ProjectCard";
import SimpleArrowDown from "@/assets/icons/SimpleArrowDown";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bars } from "react-loader-spinner";
let source: any;
const Projects = () => {
  const navigate = useRouter();
  const [projectLoading, setProjectLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjectsFromAPI("");
  }, []);

  const searchProject = (searchKeyword: any) => {
    setKeyword(searchKeyword);
    getProjectsFromAPI(searchKeyword);
  };

  const getProjectsFromAPI = async (keyword: any) => {
    try {
      if (source) {
        source.cancel();
        source = null;
      }
      source = axios.CancelToken.source();
      setProjectLoading(true);
      let url = "/api/project/list?type=directory";
      if (keyword.length > 0) {
        url = url + "&&searchText=" + keyword;
      }
      const listResult = await axios.get(url, {
        cancelToken: source.token,
      });
      setProjects(listResult.data);
      setProjectLoading(false);
    } catch (error) {
      setProjectLoading(false);
      setProjects([]);
    }
  };

  const onProjectSelect = (projectItem: any) => {
    navigate.push(`/projects/${projectItem.data.symbol.toLowerCase()}`);
  };

  return (
    <div className="relative background-content">
      <div className="flex flex-col items-center justify-center w-full py-12">
        <div className="relative w-full flex flex-col justify-center items-center">
          <div className="flex rounded-full bg-[#171646]">
            <div className="px-12 py-4 rounded-full bg-[#1A1850] cursor-pointer">
              <p className="text-lg font-bold text-white">Kinship Agents</p>
            </div>

            <div className="px-12 py-4 rounded-full cursor-pointer">
              <p className="text-lg font-bold">Personal Agents</p>
            </div>
          </div>

          <p className="text-base mt-8">
            We're designed by our creator to serve you. Activate us!
          </p>
          <div className="w-full flex justify-between items-center mt-10 px-24">
            <div className="flex">
              <p className="text-sm text-white">Sort by Subscribers</p>
            </div>
            <div className="relative flex search-container">
              <button className="btn btn-circle bg-search h-10 w-10 min-h-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Type your search terms"
                className="input bg-transparent px-2.5 h-10 border-0 focus:outline-0 text-xs w-52"
                onChange={(event) => searchProject(event.target.value)}
              />
            </div>

            <button
              className="bg-[#6607FF] rounded-md p-2"
              onClick={() => navigate.push("/create/create_projects")}
            >
              <p className="text-sm text-white">
                Create your own Kinship Agent!
              </p>
            </button>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center mx-16">
        {projects.length > 0 && !projectLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {projects.map((projectItem: any) => (
              <ProjectCard
                data={projectItem}
                onClick={() => {
                  onProjectSelect(projectItem);
                }}
                showTimer={true}
              />
            ))}
          </div>
        )}
        {projectLoading && (
          <div className="mx-auto w-20">
            <Bars
              height="80"
              width="80"
              color="rgba(255, 0, 199, 1)"
              ariaLabel="bars-loading"
              wrapperStyle={{}}
              wrapperClass="bars-loading"
              visible={projectLoading}
            />
          </div>
        )}

        {projects.length == 0 && !projectLoading && (
          <div className="text-center text-xs">Projects not available</div>
        )}
      </div>
    </div>
  );
};

export default Projects;
