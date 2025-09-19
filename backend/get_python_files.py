import os

def get_python_files(directory, indent=""):
    """Recursively get relevant Python files, excluding venv and other unnecessary directories."""
    try:
        # Get list of all items in the directory
        contents = os.listdir(directory)
        
        # Filter out unwanted directories like 'venv' and '__pycache__'
        relevant_contents = [item for item in contents if item not in ('venv', '__pycache__')]
        
        # Filter for .py files
        py_files = [item for item in relevant_contents if item.endswith('.py')]
        
        # Print Python files in current directory
        for file in py_files:
            print(f"{indent}📄 {file}")
        
        # Recursively explore subdirectories
        for item in relevant_contents:
            item_path = os.path.join(directory, item)
            if os.path.isdir(item_path):
                print(f"{indent}📁 {item}/")
                get_python_files(item_path, indent + "  ")
                
    except PermissionError:
        print(f"{indent}⚠️ Permission denied: {directory}")
    except Exception as e:
        print(f"{indent}❌ Error accessing {directory}: {e}")

# Define the starting directory (current working directory)
directory = os.getcwd()

# Print the starting directory
print(f"Folder structure starting from: {directory}")
# Call the function to get Python files
get_python_files(directory)