import { NextRequest, NextResponse } from 'next/server';
import { getFunctions, httpsCallable } from 'firebase/functions';

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();

    if (!action) {
      return NextResponse.json(
        { error: 'Action requise' },
        { status: 400 }
      );
    }

    // Initialiser Firebase Functions
    const functions = getFunctions();
    
    let result;

    switch (action) {
      case 'createQueue':
        const createQueue = httpsCallable(functions, 'createTaskQueue');
        result = await createQueue();
        break;

      case 'scheduleTask':
        const scheduleTask = httpsCallable(functions, 'schedulePublishTask');
        result = await scheduleTask(data);
        break;

      case 'listTasks':
        const listTasks = httpsCallable(functions, 'listTasks');
        result = await listTasks();
        break;

      case 'cancelTask':
        const cancelTask = httpsCallable(functions, 'cancelTask');
        result = await cancelTask(data);
        break;

      default:
        return NextResponse.json(
          { error: 'Action non supportée' },
          { status: 400 }
        );
    }

    return NextResponse.json(result.data);

  } catch (error) {
    console.error('Erreur Cloud Tasks:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
