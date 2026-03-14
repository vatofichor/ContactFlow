/*
 * MIT License
 *
 * Copyright (c) 2026:
 * vatofichor - Sebastian Mass     [>_<]
 * & Assisted By Gemini Antigravity /|\  
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * @file user_commands.js
 * @description Reflexive DOM Framework (RDF) Commands component. Powers the popup command launcher (Alt+/) and ID-based routine execution.
 */
async function run_command(skip_prompt, command) {
  const instructions = generateInstructions();
  const rawCommand = skip_prompt ? command : await prompt_cmd(instructions);
  if (!rawCommand) return; 

  const cmdLower = rawCommand.toLowerCase().trim();

  const divId = cmdLower;
  let targetDiv = document.getElementById(divId);

  
  if (!targetDiv) {
    targetDiv = document.getElementById(rawCommand.trim());
  }

  if (targetDiv) {
    targetDiv.click();
    console.log(`Running page action with ID: ${divId}`);
  } else {
    console.log(`No page action found with ID "${divId}"`);
    alert(`No page action found with ID "${divId}"`);
  }
}




function generateInstructions() {
  let helpText = "Available Commands:\n\n";

  
  const elements = document.querySelectorAll('[id][data-note]');
  
  const sortedElements = Array.from(elements).sort((a, b) => a.id.localeCompare(b.id));

  if (sortedElements.length > 0) {
    helpText += "[ COMMANDS ]\n";
    sortedElements.forEach(el => {
      if (el.id && el.dataset.note) {
        helpText += `${el.id}: ${el.dataset.note}\n`;
      }
    });
    helpText += "\n";
  }

  
  helpText += "[ KEYBOARD SHORTCUTS ]\n";

  
  const keyMap = {
    '/': "Open Command Palette",
    'm': "Menu",
    'r': "Reset Page",
    'b': "Bullet List",
    '1': "Lvl1 Snippet",
    '2': "Lvl2 Snippet",
    'n': "StarNotes Case Notes",
    't': "Lead Drawer",
    'y': "CX Survey Drawer",
    'u': "Escalations Drawer",
    'c': "Copy StarNotes",
    'h': "Find & Replace",
    'i': "ScratchNotes"
  };

  
  if (window.userCommands) {
    Object.keys(window.userCommands).sort().forEach(key => {
      let desc = keyMap[key] || `Command ${key.toUpperCase()}`;
      helpText += `Alt + ${key.toUpperCase()} : Runs \"${desc}\"\n`;
    });
  } else {
    helpText += "Shortcuts not loaded.\n";
  }

  return helpText;
}


const clean_cmd = (cmd) => {
  return cmd.toLowerCase().trim();
};


const build_prompt_screen = (message, onClose) => {
  const prompt_screen = document.createElement('div');
  prompt_screen.id = 'prompt-screen';
  prompt_screen.style.display = 'flex';
  prompt_screen.style.flexDirection = 'column';
  prompt_screen.style.alignItems = 'center';
  prompt_screen.style.position = 'fixed';
  prompt_screen.style.overflowY = 'scroll';
  prompt_screen.style.top = '0';
  prompt_screen.style.left = '0';
  prompt_screen.style.width = '100%';
  prompt_screen.style.height = '100%';
  prompt_screen.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
  prompt_screen.style.zIndex = '2500';

  let message_p = document.createElement('pre');
  message_p.textContent = message;
  message_p.style.textAlign = 'left';
  message_p.style.fontSize = '14px';
  message_p.style.fontWeight = 'bold';
  message_p.style.marginBottom = '20px';
  message_p.style.color = '#ffffff';
  message_p.style.fontFamily = 'monospace';
  message_p.style.whiteSpace = 'pre-wrap';
  prompt_screen.appendChild(message_p);

  const command_input = document.createElement('input');
  command_input.id = 'command-input';
  command_input.type = 'text';
  command_input.placeholder = 'Enter command';
  command_input.style.width = '300px';
  command_input.style.marginTop = '10px';
  command_input.style.padding = '10px 20px';
  command_input.style.backgroundColor = '#ffffff';
  command_input.style.color = '#222222';
  command_input.style.border = 'none';
  command_input.style.borderRadius = '5px';
  command_input.style.cursor = 'pointer';
  prompt_screen.appendChild(command_input);

  const close_button = document.createElement('button');
  close_button.textContent = 'Close';
  close_button.style.display = 'block';
  close_button.style.marginTop = '10px';
  close_button.style.padding = '10px 20px';
  close_button.style.backgroundColor = '#ff0000';
  close_button.style.color = '#ffffff';
  close_button.style.border = 'none';
  close_button.style.borderRadius = '5px';
  close_button.style.cursor = 'pointer';
  close_button.style.width = 'auto';

  close_button.addEventListener('click', () => {
    onClose();
  });
  prompt_screen.appendChild(close_button);

  
  prompt_screen.tabIndex = -1;
  prompt_screen.style.outline = 'none';

  return { prompt_screen, command_input };
};


const prompt_cmd = (message) => {
  
  if (document.getElementById('prompt-screen')) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    let screenObj = null;

    const cleanup = () => {
      if (screenObj && document.body.contains(screenObj.prompt_screen)) {
        document.body.removeChild(screenObj.prompt_screen);
      }
      
      screenObj = null;
      resolve(null);
    };

    screenObj = build_prompt_screen(message, cleanup);
    document.body.appendChild(screenObj.prompt_screen);

    screenObj.command_input.focus();


    screenObj.prompt_screen.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const cmd = screenObj.command_input.value;
        if (screenObj && document.body.contains(screenObj.prompt_screen)) {
          document.body.removeChild(screenObj.prompt_screen);
        }
        event.stopPropagation(); 
        screenObj = null;
        resolve(cmd);
      } else if (event.key === 'Escape') {
        event.stopPropagation(); 
        cleanup();
      }
    });

    
    screenObj.prompt_screen.addEventListener('click', (e) => {
      if (e.target === screenObj.prompt_screen) {
        screenObj.prompt_screen.focus();
      }
    });
  });
};