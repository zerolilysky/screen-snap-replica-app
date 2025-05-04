
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const questions = [
  {
    id: 1,
    text: "在社交场合中，你更倾向于：",
    options: [
      { id: "a", text: "积极参与各种活动和交流", score: 10 },
      { id: "b", text: "与少数人深入交流", score: 5 },
      { id: "c", text: "尽量避免太多社交互动", score: 0 }
    ],
    category: "extraversion"
  },
  {
    id: 2,
    text: "当面对问题时，你更喜欢：",
    options: [
      { id: "a", text: "关注具体细节和实际情况", score: 0 },
      { id: "b", text: "寻找问题背后的理论和模式", score: 5 },
      { id: "c", text: "依靠直觉和想象力", score: 10 }
    ],
    category: "sensing"
  },
  {
    id: 3,
    text: "做决定时，你更看重：",
    options: [
      { id: "a", text: "逻辑和分析的结果", score: 0 },
      { id: "b", text: "决定对人的影响", score: 5 },
      { id: "c", text: "个人价值观和情感", score: 10 }
    ],
    category: "thinking"
  },
  {
    id: 4,
    text: "你更喜欢生活：",
    options: [
      { id: "a", text: "有明确的计划和安排", score: 0 },
      { id: "b", text: "有计划但保持灵活", score: 5 },
      { id: "c", text: "随着感觉走，保持开放性", score: 10 }
    ],
    category: "judging"
  }
];

const PersonalityTest: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [scores, setScores] = useState<{[key: string]: number}>({
    extraversion: 0,
    sensing: 0,
    thinking: 0,
    judging: 0
  });
  const [testComplete, setTestComplete] = useState(false);

  const handleAnswer = (questionId: number, optionId: string, score: number, category: string) => {
    const newAnswers = { ...answers, [questionId]: optionId };
    setAnswers(newAnswers);
    
    const newScores = { ...scores, [category]: scores[category] + score };
    setScores(newScores);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setTestComplete(true);
      if (user) {
        saveTestResults(newScores);
      }
    }
  };

  const saveTestResults = async (finalScores: {[key: string]: number}) => {
    try {
      const { error } = await supabase
        .from('personality_tests')
        .insert({
          user_id: user?.id,
          extraversion: finalScores.extraversion,
          sensing: finalScores.sensing,
          thinking: finalScores.thinking,
          judging: finalScores.judging
        });
        
      if (error) throw error;
      
      toast({
        description: "测试结果已保存",
      });
    } catch (error: any) {
      console.error('保存测试结果错误:', error.message);
      toast({
        title: "保存失败",
        description: "无法保存测试结果，请稍后再试",
        variant: "destructive"
      });
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <StatusBar time="20:21" />
      
      <div className="p-4 border-b border-gray-100 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">人格测试</h1>
      </div>
      
      {!testComplete ? (
        <div className="p-4 flex-1">
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">完成进度</span>
              <span className="text-sm text-gray-500">
                {currentQuestionIndex + 1} / {questions.length}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-medium mb-6">{currentQuestion.text}</h2>
            
            <div className="space-y-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  className="w-full bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50"
                  onClick={() => handleAnswer(currentQuestion.id, option.id, option.score, currentQuestion.category)}
                >
                  <span>{option.text}</span>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 flex-1">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-medium mb-4 text-center">测试完成！</h2>
            <p className="text-gray-600 mb-6 text-center">
              感谢您完成人格测试，以下是您的人格分析结果
            </p>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">外向</span>
                  <span className="text-sm text-gray-500">内向</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-blue-400 rounded-full"
                    style={{ width: `${(scores.extraversion / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">实感</span>
                  <span className="text-sm text-gray-500">直觉</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-green-400 rounded-full"
                    style={{ width: `${(scores.sensing / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">理性</span>
                  <span className="text-sm text-gray-500">感性</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-purple-400 rounded-full"
                    style={{ width: `${(scores.thinking / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">计划</span>
                  <span className="text-sm text-gray-500">随性</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-orange-400 rounded-full"
                    style={{ width: `${(scores.judging / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full bg-blue-500 hover:bg-blue-600"
            onClick={() => navigate(-1)}
          >
            返回个人页面
          </Button>
        </div>
      )}
    </div>
  );
};

export default PersonalityTest;
