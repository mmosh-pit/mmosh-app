import { useEffect, useState } from "react";

const colorPaletteFunctionDescription = `
Use this function when a user asks about colors, color palettes, or requests to generate color combinations.
This includes queries such as:
- "Show me a color palette"
- "Generate a pastel theme"
- "I want warm color tones"
- "Suggest colors for a website"
- "Give me color schemes for a modern design"
- "What colors go well with navy blue?"

The function should also be called when users mention design aesthetics, UI themes, branding color suggestions, or mood-based color needs.
`;

const peroduaSearchFunctionDescription = `
Call this function when a user asks anything about Perodua cars, vehicles, or automotive brand. This includes questions about:
- Perodua car models (past, present, future)
- Perodua specifications, features, or prices
- Perodua history or company information
- Comparing Perodua models
- Any mention of "Perodua" brand
- Malaysian car manufacturer questions that might relate to Perodua
This tool searches a knowledge base for relevant Perodua information. Always use this tool when a user asks about Perodua cars, models, specifications, or anything related to the Perodua automotive brand.
`;

const bmwSearchFunctionDescription = `
Call this function when a user asks anything about BMW cars, vehicles, or the automotive brand. This includes questions about:
- BMW car models (past, present, future)
- BMW specifications, features, or prices
- BMW history or company information
- Comparing BMW models
- Any mention of "BMW" brand
- German luxury car manufacturer questions that might relate to BMW
This tool searches a knowledge base for relevant BMW information. Always use this tool when a user asks about BMW cars, models, specifications, or anything related to the BMW automotive brand.
`;

const deepseekSearchFunctionDescription = `
Call this function when a user asks anything about DeepSeek or related topics. This includes questions about:
- DeepSeek technology and capabilities
- DeepSeek models and features
- DeepSeek implementation and usage
- DeepSeek performance and comparisons
- Any mention of "DeepSeek" or related AI topics
This tool searches a knowledge base for relevant DeepSeek information. Always use this tool when a user asks about DeepSeek, its models, or anything related to the DeepSeek AI technology.
`;

const sessionUpdate = {
  type: "session.update",
  session: {
    tools: [
      {
        type: "function",
        name: "display_color_palette",
        description: colorPaletteFunctionDescription,
        parameters: {
          type: "object",
          strict: true,
          properties: {
            theme: {
              type: "string",
              description: "Optional theme or keyword provided by the user (e.g., pastel, vibrant, nature, modern, warm, cool, etc.)",
            },
            colors: {
              type: "array",
              description: "Array of five hex color codes based on the theme.",
              items: {
                type: "string",
                description: "Hex color code",
              },
            },
          },
          required: ["theme", "colors"],
        },
      },
      {
        type: "function",
        name: "search_perodua_info",
        description: peroduaSearchFunctionDescription,
        parameters: {
          type: "object",
          strict: true,
          properties: {
            query: {
              type: "string",
              description: "The user's question or search query about Perodua cars. Examples: 'What Perodua models are available?', 'Tell me about past Perodua models', 'Perodua car specifications', 'Perodua history'.",
            },
          },
          required: ["query"],
        },
      },
      {
        type: "function",
        name: "search_bmw_info",
        description: bmwSearchFunctionDescription,
        parameters: {
          type: "object",
          strict: true,
          properties: {
            query: {
              type: "string",
              description: "The user's question or search query about BMW cars. Examples: 'What BMW models are available?', 'Tell me about BMW M series', 'BMW specifications', 'BMW history'.",
            },
          },
          required: ["query"],
        },
      },
      {
        type: "function",
        name: "search_deepseek_info",
        description: deepseekSearchFunctionDescription,
        parameters: {
          type: "object",
          strict: true,
          properties: {
            query: {
              type: "string",
              description: "The user's question or search query about DeepSeek. Examples: 'What is DeepSeek?', 'How does DeepSeek work?', 'DeepSeek capabilities', 'DeepSeek performance'.",
            },
          },
          required: ["query"],
        },
      },
    ],
    tool_choice: "auto",
    instructions: `
      Follow these guidelines for tool selection:
      
      1. COLOR PALETTE TOOL:
         - USE WHEN: User mentions colors, themes, design palettes, visual aesthetics
         - EXAMPLES: "I need colors for a beach theme", "What colors go with blue?", "Suggest a modern color scheme"
         
      2. PERODUA INFO TOOL:
         - USE WHEN: Any mention of Perodua, Malaysian cars, specific model names (Myvi, Axia, etc.)
         - EXAMPLES: "Tell me about Perodua", "What models does Perodua offer?"
         
      3. BMW INFO TOOL:
         - USE WHEN: Any mention of BMW, German luxury cars, specific BMW models
         - EXAMPLES: "Tell me about BMW", "What BMW models are available?"
         
      4. DEEPSEEK INFO TOOL:
         - USE WHEN: Any mention of DeepSeek, AI models, or related technology
         - EXAMPLES: "What is DeepSeek?", "How does DeepSeek work?"
         
      5. NO TOOL NEEDED:
         - If the query doesn't clearly relate to any of the above topics, respond directly
         - For general greetings, clarification questions, or follow-ups
         
      Always provide natural, conversational responses and maintain context between interactions.
    `
  },
};

function ColorPaletteFunctionCallOutput({ functionCallOutput }: { functionCallOutput: any }) {
  let theme = "Unknown";
  let colors: string[] = [];
  
  try {
    const args = JSON.parse(functionCallOutput.arguments);
    theme = args.theme || "Unknown";
    colors = Array.isArray(args.colors) ? args.colors : [];
    console.log("Successfully parsed color palette:", { theme, colors });
  } catch (error) {
    console.error("Error parsing color palette arguments:", error);
    theme = "Error parsing theme";
    colors = [];
  }

  const colorBoxes = Array.isArray(colors) && colors.length > 0 
    ? colors.map((color) => (
        <div
          key={color}
          className="w-full h-16 rounded-md flex items-center justify-center border border-gray-200"
          style={{ backgroundColor: color }}
        >
          <p className="text-sm font-bold text-black bg-slate-100 rounded-md p-2 border border-black">
            {color}
          </p>
        </div>
      ))
    : <p className="text-red-500">No colors provided</p>;

  return (
    <div className="flex flex-col gap-2">
      <p>Theme: {theme}</p>
      {colorBoxes}
      <pre className="text-xs bg-gray-100 rounded-md p-2 overflow-x-auto">
        {JSON.stringify(functionCallOutput, null, 2)}
      </pre>
    </div>
  );
}

function PeroduaFunctionCallOutput({ functionCallOutput, searchResults }: { functionCallOutput: any, searchResults: any }) {
  const { query } = JSON.parse(functionCallOutput.arguments);

  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold">Search Query: {query}</p>
      {searchResults ? (
        <div className="space-y-2">
          <p className="text-sm text-green-600">{searchResults.message}</p>
          {searchResults.results && searchResults.results.length > 0 ? (
            <div className="space-y-2">
              {searchResults.results.map((result: any, index: number) => (
                <div key={result.id || index} className="bg-white p-3 rounded border">
                  <p className="text-xs text-gray-500 mb-1">Score: {result.score?.toFixed(4)}</p>
                  {result.metadata && (
                    <div className="text-sm">
                      {Object.entries(result.metadata).map(([key, value]) => (
                        <div key={key} className="mb-1">
                          <span className="font-medium">{key}:</span> {String(value)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No results found</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-blue-500">Searching...</p>
      )}
      <pre className="text-xs bg-gray-100 rounded-md p-2 overflow-x-auto">
        {JSON.stringify(functionCallOutput, null, 2)}
      </pre>
    </div>
  );
}

function BMWFunctionCallOutput({ functionCallOutput, searchResults }: { functionCallOutput: any, searchResults: any }) {
  const { query } = JSON.parse(functionCallOutput.arguments);

  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold">Search Query: {query}</p>
      {searchResults ? (
        <div className="space-y-2">
          <p className="text-sm text-green-600">{searchResults.message}</p>
          {searchResults.results && searchResults.results.length > 0 ? (
            <div className="space-y-2">
              {searchResults.results.map((result: any, index: number) => (
                <div key={result.id || index} className="bg-white p-3 rounded border">
                  <p className="text-xs text-gray-500 mb-1">Score: {result.score?.toFixed(4)}</p>
                  {result.metadata && (
                    <div className="text-sm">
                      {Object.entries(result.metadata).map(([key, value]) => (
                        <div key={key} className="mb-1">
                          <span className="font-medium">{key}:</span> {String(value)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No results found</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-blue-500">Searching...</p>
      )}
      <pre className="text-xs bg-gray-100 rounded-md p-2 overflow-x-auto">
        {JSON.stringify(functionCallOutput, null, 2)}
      </pre>
    </div>
  );
}

function DeepSeekFunctionCallOutput({ functionCallOutput, searchResults }: { functionCallOutput: any, searchResults: any }) {
  const { query } = JSON.parse(functionCallOutput.arguments);

  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold">Search Query: {query}</p>
      {searchResults ? (
        <div className="space-y-2">
          <p className="text-sm text-green-600">{searchResults.message}</p>
          {searchResults.results && searchResults.results.length > 0 ? (
            <div className="space-y-2">
              {searchResults.results.map((result: any, index: number) => (
                <div key={result.id || index} className="bg-white p-3 rounded border">
                  <p className="text-xs text-gray-500 mb-1">Score: {result.score?.toFixed(4)}</p>
                  {result.metadata && (
                    <div className="text-sm">
                      {Object.entries(result.metadata).map(([key, value]) => (
                        <div key={key} className="mb-1">
                          <span className="font-medium">{key}:</span> {String(value)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No results found</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-blue-500">Searching...</p>
      )}
      <pre className="text-xs bg-gray-100 rounded-md p-2 overflow-x-auto">
        {JSON.stringify(functionCallOutput, null, 2)}
      </pre>
    </div>
  );
}

interface VoiceToolPanelProps {
  isSessionActive: boolean;
  sendClientEvent: (message: any) => void;
  events: any[];
}

export default function VoiceToolPanel({
  isSessionActive,
  sendClientEvent,
  events,
}: VoiceToolPanelProps) {
  const [functionAdded, setFunctionAdded] = useState(false);
  const [colorPaletteFunctionCallOutput, setColorPaletteFunctionCallOutput] = useState<any>(null);
  const [peroduaFunctionCallOutput, setPeroduaFunctionCallOutput] = useState<any>(null);
  const [peroduaSearchResults, setPeroduaSearchResults] = useState<any>(null);
  const [bmwFunctionCallOutput, setBmwFunctionCallOutput] = useState<any>(null);
  const [bmwSearchResults, setBmwSearchResults] = useState<any>(null);
  const [deepseekFunctionCallOutput, setDeepseekFunctionCallOutput] = useState<any>(null);
  const [deepseekSearchResults, setDeepseekSearchResults] = useState<any>(null);
  const [processedCalls, setProcessedCalls] = useState(new Set<string>());

  // Function to handle Perodua search
  const handlePeroduaSearch = async (query: string, callId: string) => {
    try {
      const response = await fetch('/api/search-perodua', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      const data = await response.json();
      setPeroduaSearchResults(data);
      
      // Send the function call output back to the AI with the search results
      setTimeout(() => {
        sendClientEvent({
          type: "conversation.item.create",
          item: {
            type: "function_call_output",
            call_id: callId,
            output: JSON.stringify({
              success: true,
              message: data.message,
              results: data.results,
              searchQuery: query,
              detailedInfo: data.results.map((result: any) => ({
                score: result.score,
                content: result.metadata
              }))
            }),
          },
        });
        sendClientEvent({ 
          type: "response.create",
          response: {
            instructions: `
              Based on the search results provided, give a comprehensive answer about Perodua cars. 
              Use the specific information found in the search results to provide detailed, accurate information.
              Be conversational and helpful in your response.
            `,
          },
        });
      }, 500);
    } catch (error) {
      console.error('Error searching Perodua info:', error);
      setPeroduaSearchResults({
        error: 'Failed to search',
        message: 'There was an error searching for Perodua information'
      });
      
      // Send error response back to AI
      setTimeout(() => {
        sendClientEvent({
          type: "conversation.item.create",
          item: {
            type: "function_call_output",
            call_id: callId,
            output: JSON.stringify({
              success: false,
              error: 'Failed to search for Perodua information',
              message: 'There was an error accessing the knowledge base'
            }),
          },
        });
        sendClientEvent({ 
          type: "response.create",
          response: {
            instructions: `
              Apologize for the technical issue and let the user know that the Perodua information search 
              is temporarily unavailable. Suggest they try again later.
            `,
          },
        });
      }, 500);
    }
  };

  // Function to handle BMW search
  const handleBMWSearch = async (query: string, callId: string) => {
    try {
      const response = await fetch('/api/search-bmw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      const data = await response.json();
      setBmwSearchResults(data);
      
      setTimeout(() => {
        sendClientEvent({
          type: "conversation.item.create",
          item: {
            type: "function_call_output",
            call_id: callId,
            output: JSON.stringify({
              success: true,
              message: data.message,
              results: data.results,
              searchQuery: query,
              detailedInfo: data.results.map((result: any) => ({
                score: result.score,
                content: result.metadata
              }))
            }),
          },
        });
        sendClientEvent({ 
          type: "response.create",
          response: {
            instructions: `
              Based on the search results provided, give a comprehensive answer about BMW cars. 
              Use the specific information found in the search results to provide detailed, accurate information.
              Be conversational and helpful in your response.
            `,
          },
        });
      }, 500);
    } catch (error) {
      console.error('Error searching BMW info:', error);
      setBmwSearchResults({
        error: 'Failed to search',
        message: 'There was an error searching for BMW information'
      });
      
      setTimeout(() => {
        sendClientEvent({
          type: "conversation.item.create",
          item: {
            type: "function_call_output",
            call_id: callId,
            output: JSON.stringify({
              success: false,
              error: 'Failed to search for BMW information',
              message: 'There was an error accessing the knowledge base'
            }),
          },
        });
        sendClientEvent({ 
          type: "response.create",
          response: {
            instructions: `
              Apologize for the technical issue and let the user know that the BMW information search 
              is temporarily unavailable. Suggest they try again later.
            `,
          },
        });
      }, 500);
    }
  };

  // Function to handle DeepSeek search
  const handleDeepSeekSearch = async (query: string, callId: string) => {
    try {
      const response = await fetch('/api/search-deepseek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      const data = await response.json();
      setDeepseekSearchResults(data);
      
      setTimeout(() => {
        sendClientEvent({
          type: "conversation.item.create",
          item: {
            type: "function_call_output",
            call_id: callId,
            output: JSON.stringify({
              success: true,
              message: data.message,
              results: data.results,
              searchQuery: query,
              detailedInfo: data.results.map((result: any) => ({
                score: result.score,
                content: result.metadata
              }))
            }),
          },
        });
        sendClientEvent({ 
          type: "response.create",
          response: {
            instructions: `
              Based on the search results provided, give a comprehensive answer about DeepSeek. 
              Use the specific information found in the search results to provide detailed, accurate information.
              Be conversational and helpful in your response.
            `,
          },
        });
      }, 500);
    } catch (error) {
      console.error('Error searching DeepSeek info:', error);
      setDeepseekSearchResults({
        error: 'Failed to search',
        message: 'There was an error searching for DeepSeek information'
      });
      
      setTimeout(() => {
        sendClientEvent({
          type: "conversation.item.create",
          item: {
            type: "function_call_output",
            call_id: callId,
            output: JSON.stringify({
              success: false,
              error: 'Failed to search for DeepSeek information',
              message: 'There was an error accessing the knowledge base'
            }),
          },
        });
        sendClientEvent({ 
          type: "response.create",
          response: {
            instructions: `
              Apologize for the technical issue and let the user know that the DeepSeek information search 
              is temporarily unavailable. Suggest they try again later.
            `,
          },
        });
      }, 500);
    }
  };

  // Function to process function calls (unified handler)
  const processFunctionCall = (functionCall: any, source: string) => {
    console.log(`Processing function call from ${source}:`, functionCall);
    
    // Prevent duplicate processing
    const callKey = `${functionCall.call_id}_${functionCall.name}`;
    if (processedCalls.has(callKey)) {
      console.log("Function call already processed, skipping:", callKey);
      return;
    }
    
    // Mark as processed
    setProcessedCalls(prev => new Set([...prev, callKey]));
    
    if (functionCall.name === "display_color_palette") {
      console.log(`Color palette function called via ${source}:`, functionCall);
      
      // Get the arguments safely
      let args;
      try {
        args = JSON.parse(functionCall.arguments);
        console.log("Color palette arguments:", args);
      } catch (error) {
        console.error("Failed to parse color palette arguments:", error);
        args = { theme: "default" };
      }
      
      // Make sure we have colors array (generate default colors if not provided)
      if (!args.colors || !Array.isArray(args.colors) || args.colors.length === 0) {
        console.log("No colors provided, generating default colors");
        args.colors = ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33F3"];
      }
      
      // Update state AFTER we've safely processed the arguments
      setColorPaletteFunctionCallOutput({
        ...functionCall,
        arguments: JSON.stringify(args)
      });
      
      // Send the function call output back to the model
      setTimeout(() => {
        console.log("Sending color palette function call output with colors:", args.colors);
        sendClientEvent({
          type: "conversation.item.create",
          item: {
            type: "function_call_output",
            call_id: functionCall.call_id,
            output: JSON.stringify({
              success: true,
              message: "Color palette generated successfully",
              theme: args.theme || "default",
              colors: args.colors
            }),
          },
        });
        
        // Then ask for feedback
        sendClientEvent({
          type: "response.create",
          response: {
            instructions: `
              Based on the color palette provided, give a brief description of how these colors work together.
              Ask for feedback about the color palette - don't repeat the colors, just ask if they like the colors.
            `,
          },
        });
      }, 500);
    } else if (functionCall.name === "search_perodua_info") {
      console.log(`search_perodua_info function called via ${source}!`);
      setPeroduaFunctionCallOutput(functionCall);
      setPeroduaSearchResults(null); // Reset previous results
      const { query } = JSON.parse(functionCall.arguments);
      
      // Then start the search process
      handlePeroduaSearch(query, functionCall.call_id);
    } else if (functionCall.name === "search_bmw_info") {
      console.log(`search_bmw_info function called via ${source}!`);
      setBmwFunctionCallOutput(functionCall);
      setBmwSearchResults(null); // Reset previous results
      const { query } = JSON.parse(functionCall.arguments);
      handleBMWSearch(query, functionCall.call_id);
    } else if (functionCall.name === "search_deepseek_info") {
      console.log(`search_deepseek_info function called via ${source}!`);
      setDeepseekFunctionCallOutput(functionCall);
      setDeepseekSearchResults(null); // Reset previous results
      const { query } = JSON.parse(functionCall.arguments);
      handleDeepSeekSearch(query, functionCall.call_id);
    }
  };

  useEffect(() => {
    if (!events || events.length === 0) return;

    // Debug: Log all events to see the full conversation flow
    console.log("All recent events:", events.slice(0, 3));

    const firstEvent = events[events.length - 1];
    if (!functionAdded && firstEvent.type === "session.created") {
      sendClientEvent(sessionUpdate);
      setFunctionAdded(true);
      console.log("Tools registered with session");
    }

    const mostRecentEvent = events[0];
    console.log("Most recent event:", mostRecentEvent.type, mostRecentEvent);
    
    // Check for any function call events
    if (mostRecentEvent.type === "response.function_call_arguments.delta" || 
        mostRecentEvent.type === "response.function_call_arguments.done") {
      console.log("Function call event detected:", mostRecentEvent);
    }

    // Handle function call completion
    if (mostRecentEvent.type === "response.function_call_arguments.done") {
      console.log("Function call completed:", mostRecentEvent);
      const functionCall = {
        type: "function_call",
        name: mostRecentEvent.name,
        call_id: mostRecentEvent.call_id,
        arguments: mostRecentEvent.arguments
      };
      
      processFunctionCall(functionCall, "response.function_call_arguments.done");
    }

    // Handle output item completion (alternative function call completion path)
    if (mostRecentEvent.type === "response.output_item.done" && mostRecentEvent.item) {
      console.log("Output item completed:", mostRecentEvent);
      if (mostRecentEvent.item.type === "function_call") {
        const functionCall = mostRecentEvent.item;
        console.log("Function call from output item:", functionCall);
        
        processFunctionCall(functionCall, "response.output_item.done");
      }
    }
    
    if (
      mostRecentEvent.type === "response.done" &&
      mostRecentEvent.response.output
    ) {
      console.log("Response output:", mostRecentEvent.response.output);
      mostRecentEvent.response.output.forEach((output: any) => {
        console.log("Processing output:", output.type, output.name);
        if (output.type === "function_call") {
          processFunctionCall(output, "response.done");
        }
      });
    }
  }, [events]);

  useEffect(() => {
    if (!isSessionActive) {
      setFunctionAdded(false);
      setColorPaletteFunctionCallOutput(null);
      setPeroduaFunctionCallOutput(null);
      setPeroduaSearchResults(null);
      setBmwFunctionCallOutput(null);
      setBmwSearchResults(null);
      setDeepseekFunctionCallOutput(null);
      setDeepseekSearchResults(null);
      setProcessedCalls(new Set());
    }
  }, [isSessionActive]);

  return (
    <section className="h-full w-full flex flex-col gap-4">
      {/* Color Palette Tool */}
      <div className="bg-gray-50 rounded-md p-4 flex-1">
        <h2 className="text-lg font-bold text-gray-900">Color Palette Tool</h2>
        <div className="mt-2">
          {isSessionActive ? (
            colorPaletteFunctionCallOutput ? (
              <div className="color-palette-output">
                <p className="text-sm mb-2 text-gray-800">Color palette requested:</p>
                <ColorPaletteFunctionCallOutput functionCallOutput={colorPaletteFunctionCallOutput} />
              </div>
            ) : (
              <p className="text-gray-800 font-medium">Ask for advice on a color palette...</p>
            )
          ) : (
            <p className="text-gray-800 font-medium">Start the session to use this tool...</p>
          )}
        </div>
      </div>

      {/* Perodua Search Tool */}
      <div className="bg-blue-50 rounded-md p-4 flex-1">
        <h2 className="text-lg font-bold text-gray-900">Perodua Information Tool</h2>
        <div className="mt-2">
          {isSessionActive ? (
            peroduaFunctionCallOutput ? (
              <div className="perodua-output">
                <p className="text-sm mb-2 text-gray-800">Search results:</p>
                <PeroduaFunctionCallOutput 
                  functionCallOutput={peroduaFunctionCallOutput} 
                  searchResults={peroduaSearchResults}
                />
              </div>
            ) : (
              <p className="text-gray-800 font-medium">Ask questions about Perodua cars...</p>
            )
          ) : (
            <p className="text-gray-800 font-medium">Start the session to use this tool...</p>
          )}
        </div>
      </div>

      {/* BMW Search Tool */}
      <div className="bg-red-50 rounded-md p-4 flex-1">
        <h2 className="text-lg font-bold text-gray-900">BMW Information Tool</h2>
        <div className="mt-2">
          {isSessionActive ? (
            bmwFunctionCallOutput ? (
              <div className="bmw-output">
                <p className="text-sm mb-2 text-gray-800">Search results:</p>
                <BMWFunctionCallOutput 
                  functionCallOutput={bmwFunctionCallOutput} 
                  searchResults={bmwSearchResults}
                />
              </div>
            ) : (
              <p className="text-gray-800 font-medium">Ask questions about BMW cars...</p>
            )
          ) : (
            <p className="text-gray-800 font-medium">Start the session to use this tool...</p>
          )}
        </div>
      </div>

      {/* DeepSeek Search Tool */}
      <div className="bg-purple-50 rounded-md p-4 flex-1">
        <h2 className="text-lg font-bold text-gray-900">DeepSeek Information Tool</h2>
        <div className="mt-2">
          {isSessionActive ? (
            deepseekFunctionCallOutput ? (
              <div className="deepseek-output">
                <p className="text-sm mb-2 text-gray-800">Search results:</p>
                <DeepSeekFunctionCallOutput 
                  functionCallOutput={deepseekFunctionCallOutput} 
                  searchResults={deepseekSearchResults}
                />
              </div>
            ) : (
              <p className="text-gray-800 font-medium">Ask questions about DeepSeek...</p>
            )
          ) : (
            <p className="text-gray-800 font-medium">Start the session to use this tool...</p>
          )}
        </div>
      </div>
      
      {/* Status display */}
      <div className="bg-gray-100 rounded-md p-2 text-xs">
        <p>Session active: {isSessionActive ? "Yes" : "No"}</p>
        <p>Color tool used: {colorPaletteFunctionCallOutput ? "Yes" : "No"}</p>
        <p>Perodua tool used: {peroduaFunctionCallOutput ? "Yes" : "No"}</p>
        <p>BMW tool used: {bmwFunctionCallOutput ? "Yes" : "No"}</p>
        <p>DeepSeek tool used: {deepseekFunctionCallOutput ? "Yes" : "No"}</p>
      </div>
    </section>
  );
} 