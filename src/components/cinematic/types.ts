export interface CameraState {
  x: number;
  y: number;
  zoom: number;
}

export interface Scene {
  id: number;
  duration: number;
  visibleLayer: 'title' | 'context' | 'query' | 'tree' | 'detail' | 'answer';
  camera: CameraState;
  title: string;
  description: string;
}

export const scenes: Scene[] = [
  {
    id: 0,
    duration: 3,
    visibleLayer: 'title',
    camera: { x: 0, y: 0, zoom: 1 },
    title: 'Title',
    description: 'Introduction to RLMs',
  },
  {
    id: 1,
    duration: 6,
    visibleLayer: 'context',
    camera: { x: 0, y: 0, zoom: 1 },
    title: 'Context',
    description: 'Full context document',
  },
  {
    id: 2,
    duration: 4,
    visibleLayer: 'query',
    camera: { x: 0, y: 0, zoom: 1.2 },
    title: 'Query',
    description: 'User query input',
  },
  {
    id: 3,
    duration: 6,
    visibleLayer: 'tree',
    camera: { x: 0, y: 0, zoom: 1.1 },
    title: 'Tree',
    description: 'Recursive strategy tree',
  },
  {
    id: 4,
    duration: 8,
    visibleLayer: 'detail',
    camera: { x: 0, y: 0, zoom: 1.3 },
    title: 'Detail',
    description: 'Sub-LLM processing detail',
  },
  {
    id: 5,
    duration: 5,
    visibleLayer: 'answer',
    camera: { x: 0, y: 0, zoom: 1 },
    title: 'Answer',
    description: 'Final synthesized answer',
  },
];

export const EXAMPLE_CONTEXT = `# Python API Server - Code Review Notes
# File: api_server.py (Lines 1-450)
# Last Modified: January 15, 2025
# Reviewer: Alex Zhang (MIT CSAIL)

## 1. Authentication System (Lines 1-85)
class AuthenticationManager:
    """Handles JWT-based authentication for API endpoints"""
    
    def __init__(self, secret_key: str):
        self.secret_key = secret_key
        self.token_expiry = 3600  # 1 hour
        
    def generate_token(self, user_id: str) -> str:
        """Generate JWT token for authenticated user"""
        payload = {
            'user_id': user_id,
            'exp': datetime.now() + timedelta(seconds=self.token_expiry)
        }
        return jwt.encode(payload, self.secret_key, algorithm='HS256')
    
    # TODO: Add refresh token mechanism
    # CRITICAL: Token rotation needed for security compliance

## 2. Database Connection Pool (Lines 86-145)
class DatabasePool:
    """PostgreSQL connection pooling with retry logic"""
    
    def __init__(self, config: Dict):
        self.host = config['host']
        self.port = config['port']
        self.max_connections = 50
        self.min_connections = 10
        
    async def execute_query(self, sql: str, params: tuple):
        """Execute SQL with automatic retry on connection failure"""
        max_retries = 3
        for attempt in range(max_retries):
            try:
                async with self.pool.acquire() as conn:
                    return await conn.fetch(sql, *params)
            except ConnectionError as e:
                if attempt == max_retries - 1:
                    raise DatabaseConnectionError(f"Failed after {max_retries} attempts")
                await asyncio.sleep(2 ** attempt)
    
    # BUG FIX (Jan 10): Added exponential backoff for retries
    # Performance: Average query time reduced from 450ms to 120ms

## 3. Rate Limiting Middleware (Lines 146-210)
class RateLimiter:
    """Token bucket algorithm for API rate limiting"""
    
    def __init__(self, requests_per_minute: int = 60):
        self.capacity = requests_per_minute
        self.tokens = requests_per_minute
        self.last_refill = time.time()
        
    async def check_limit(self, client_id: str) -> bool:
        """Check if client has available tokens"""
        await self._refill_tokens()
        
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False
    
    # NOTE: Consider implementing Redis-based distributed rate limiting
    # for multi-instance deployments

## 4. Caching Layer (Lines 211-280)
class CacheManager:
    """Redis-based caching with LRU eviction policy"""
    
    def __init__(self, redis_url: str):
        self.redis = aioredis.from_url(redis_url)
        self.default_ttl = 300  # 5 minutes
        
    async def get_cached(self, key: str) -> Optional[str]:
        """Retrieve cached value if exists and not expired"""
        value = await self.redis.get(key)
        if value:
            # Cache hit - update hit counter
            await self.redis.incr(f"cache:hits:{key}")
            return json.loads(value)
        return None
    
    async def set_cached(self, key: str, value: Any, ttl: int = None):
        """Cache value with optional custom TTL"""
        ttl = ttl or self.default_ttl
        await self.redis.setex(
            key, 
            ttl, 
            json.dumps(value, default=str)
        )
    
    # OPTIMIZATION: Cache hit rate improved from 45% to 78% after
    # implementing predictive pre-caching for common queries

## 5. API Endpoints (Lines 281-380)
class APIRoutes:
    """FastAPI route definitions and handlers"""
    
    @app.get("/api/v3/users/{user_id}")
    async def get_user(user_id: str, token: str = Depends(verify_token)):
        """Fetch user details by ID"""
        # Check cache first
        cached = await cache.get_cached(f"user:{user_id}")
        if cached:
            return JSONResponse(cached)
        
        # Query database
        user = await db.execute_query(
            "SELECT * FROM users WHERE id = $1",
            (user_id,)
        )
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Cache result
        await cache.set_cached(f"user:{user_id}", user[0], ttl=600)
        return JSONResponse(user[0])
    
    # DEPRECATION NOTICE: v2 endpoints will be removed on March 1, 2025
    # Migration guide: https://docs.example.com/v2-to-v3

## 6. Error Handling (Lines 381-430)
class ErrorHandler:
    """Global exception handling and logging"""
    
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        """Catch-all exception handler with detailed logging"""
        error_id = str(uuid.uuid4())
        
        # Log error with context
        logger.error(
            f"Error ID: {error_id} | Path: {request.url.path} | "
            f"Method: {request.method} | Exception: {str(exc)}",
            exc_info=True
        )
        
        # Return sanitized error to client
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal server error",
                "error_id": error_id,
                "timestamp": datetime.now().isoformat()
            }
        )
    
    # SECURITY: Never expose stack traces to clients in production
    # All sensitive errors logged to secure audit trail

## 7. Performance Metrics (Lines 431-450)
# Average response time: 120ms (p50), 245ms (p95)
# Request throughput: 5000 req/s sustained
# Error rate: 0.02% (down from 0.5% in v2)
# Cache hit rate: 78%
# Database connection pool utilization: 65%
# Memory usage: 1.2GB average, 1.8GB peak
# CPU usage: 35% average, 60% peak

## Code Review Summary:
# ✅ APPROVED with minor comments
# - Excellent error handling and retry logic
# - Good performance optimizations implemented
# - Cache strategy is effective
# - Security best practices followed
# 
# Action Items:
# - Add token refresh mechanism (Priority: HIGH)
# - Implement distributed rate limiting (Priority: MEDIUM)
# - Complete v2 API deprecation plan (Priority: LOW)
# - Add integration tests for error scenarios (Priority: MEDIUM)
#
# Next Review: February 15, 2025`;

export const EXAMPLE_QUERY = "What was the performance improvement for database queries and when was the bug fix implemented?";

export const EXAMPLE_ANSWER = "The database query performance improved from 450ms to 120ms average query time. The bug fix that added exponential backoff for retries was implemented on January 10, 2025.";

export interface TreeNode {
  id: string;
  label: string;
  status: 'complete' | 'active' | 'pending';
  x: number;
  y: number;
  chunk?: string | null;
}

export const treeNodes: TreeNode[] = [
  { id: 'root', label: 'Strategy: Grep+Chunk', status: 'complete', x: 180, y: 40, chunk: null },
  { id: 'sub1', label: 'Search: "Lisa"', status: 'complete', x: 60, y: 160, chunk: 'Lines 1-15' },
  { id: 'sub2', label: 'Analyze Chunk #2', status: 'active', x: 180, y: 160, chunk: 'Lines 16-30' },
  { id: 'sub3', label: 'Verify Context', status: 'pending', x: 300, y: 160, chunk: 'Lines 31-45' },
];

export interface DetailData {
  title: string;
  input: string;
  chunk: string;
  processing: string;
  result: string;
}

export const detailData: DetailData = {
  title: 'Sub-LLM #2',
  input: "Find Lisa Park's role transition date",
  chunk: `3. Team Updates (Jennifer Walsh)
   - New hires: 3 backend engineers...
   - Offboarding: Lisa Park transitioning to Advisory role Feb 1
   - Team morale score: 8.7/10...`,
  processing: 'Searching for "Lisa Park" and "role"...',
  result: 'Found: Lisa Park → Advisory role, Date: February 1, 2025',
};
