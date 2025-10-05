

const api_base_url = process.env.NEXT_PUBLIC_API_URL;

export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export async function generateCard(name: string, stacks: Array<{ name: string; icon: string }>) {
  const response = await fetch('http://localhost:8082/api/generate-card/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, stacks }),
  });
  return response.json();
}

export async function saveCard(name: string, stacks: Array<{ name: string; icon: string }>) {
  const response = await fetch('http://localhost:8082/api/save-card/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, stacks }),
  });
  return response.json();
}

// export async function uploadImageForProcessing(image_file: File, name: string,operation_type: string) {

//    const formData = new FormData();
//   const response = await fetch('http://localhost:8082/api/save-card/', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ name, stacks }),
//   });
//   return response.json();
//}

export async function getServerDataFrom(msg:string) {
    console.log('Fetching test message is :', msg);
  const response = await fetch('http://localhost:8082/api/hello/',{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log('Response from test message is :', response);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}



export async function getTestMessage(msg:string) {
    console.log('Fetching test message is :', msg);
  const response = await fetch('http://localhost:8082/api/hello/',{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log('Response from test message is :', response);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}